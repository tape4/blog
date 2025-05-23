---
title: "RustC: C 컴파일러"
description: "Rust로 구현한 미니 C 컴파일러"
date: "May 21 2025"
repoURL: "https://github.com/tape4/rustc"
---

## 소개

학교에서는 4-1 학기에 ‘컴파일러’라는 과목이 있지만, 강의 담당 교수가 없거나 개설 자체가 오래 중단되어 있어 실제 강의를 들어본 경험이 없다. 전공자라면 반드시 이해해야 할 핵심 영역이라 생각해, 혼자서라도 컴파일러의 원리를 직접 익히기로 마음먹었다.

이 프로젝트는 이러한 목표 아래, Rust 언어로 직접 구현해 보는 학습용 C 컴파일러 프로젝트다. C 언어의 핵심 컴파일러 구성 요소—렉서(lexer), 파서(parser), AST 구축부터 시작하여, 이후 의미 분석(semantic analysis), 타입 검사(type checking), 중간 표현(IR) 생성 및 코드 생성 단계까지 차근차근 완성해 나가는 것을 목표로 삼고 있다. 현재는 렉싱(Lexing)과 파싱(Parsing)모듈만을 구현했으며, 앞으로 남은 단계들도 구현해 나갈 예정이다.

---

## 문법

```
program               ::= function*

function              ::= function_declaration
                        | function_definition

function_declaration  ::= type_specifier identifier "(" ( "void" | parameter_list )? ")" ";"
function_definition   ::= type_specifier identifier "(" ( "void" | parameter_list )? ")" block

parameter_list        ::= parameter ( "," parameter )*
parameter             ::= type_specifier identifier ( "[" int_literal? "]" )?

type_specifier        ::= ( "int" | "char" | "void" ) "*"*

block                 ::= "{" statement* "}"

statement             ::= block
                        | if_statement
                        | while_statement
                        | for_statement
                        | return_statement
                        | break_statement
                        | continue_statement
                        | declaration_statement
                        | expression_statement

declaration_statement ::= type_specifier init_declarator_list ";"
init_declarator_list  ::= init_declarator ( "," init_declarator )*
init_declarator       ::= declarator ( "=" initializer )?
declarator            ::= identifier ( "[" int_literal "]" )?

initializer           ::= expression
                       | "{" initializer_list? "}"
initializer_list      ::= initializer ( "," initializer )* ","?

expression_statement  ::= expression? ";"

if_statement          ::= "if" "(" expression ")" statement ( "else" statement )?
while_statement       ::= "while" "(" expression ")" statement
for_statement         ::= "for" "(" expression? ";" expression? ";" expression? ")" statement
return_statement      ::= "return" expression? ";"
break_statement       ::= "break" ";"
continue_statement    ::= "continue" ";"

expression            ::= assignment
assignment            ::= logical_or ( ( "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "&=" | "|=" | "^=" ) assignment )?

logical_or            ::= logical_and ( "||" logical_and )*
logical_and           ::= bitwise_or ( "&&" bitwise_or )*
bitwise_or            ::= bitwise_xor ( "|" bitwise_xor )*
bitwise_xor           ::= bitwise_and ( "^" bitwise_and )*
bitwise_and           ::= equality ( "&" equality )*

equality              ::= relational ( ( "==" | "!=" ) relational )*
relational            ::= additive ( ( "<" | "<=" | ">" | ">=" ) additive )*
additive              ::= multiplicative ( ( "+" | "-" ) multiplicative )*
multiplicative        ::= unary ( ( "*" | "/" | "%" ) unary )*

unary                 ::= ( "!" | "-" | "&" | "*" | "++" | "--" ) unary
                        | postfix
postfix               ::= primary postfix_op*
postfix_op            ::= "(" argument_list? ")"
                        | "[" expression "]"
                        | "++"
                        | "--"

primary               ::= identifier
                        | int_literal
                        | char_literal
                        | "(" expression ")"
                        | "{" initializer_list? "}"

argument_list         ::= expression ( "," expression )*

identifier            ::= /* Ident(String) */
int_literal           ::= /* IntLiteral(i64) */
char_literal          ::= /* CharLiteral(char) */
```

---

## 왜 Rust인가?

-   **메모리 안전성**: 소유권과 빌림 시스템 덕분에, 컴파일러 내부 데이터 구조를 구현하면서 메모리 누수나 데이터 경합을 미연에 방지할 수 있다.
-   **높은 성능**: C/C++에 필적하는 성능으로, 컴파일러 같은 성능 민감 애플리케이션에서 충분히 속도 경쟁력을 유지한다.
-   **표현력 있는 문법**: `enum`과 `match` 같은 강력한 패턴 매칭 기능으로, 토큰 분리나 AST 순회 같은 로직을 간결하고 명확하게 표현할 수 있다.

```rust
#[derive(Debug, PartialEq, Clone)]
pub enum Token {
    EOF,
    Error(LexError),
    Illegal(char),
    Ident(String),
    IntLiteral(i64),
    Plus, Minus, Star, Slash,
    // … 그 외 토큰
}

// lexer.rs 중 일부
let tok = match self.ch {
    Some('+') => {
        if self.peek_char() == Some('+') { // ++
            self.read_char();
            Token::Increment
        } else if self.peek_char() == Some('=') { // +=
            self.read_char();
            Token::PlusAssign
        } else { // +
            Token::Plus
        }
    }

    Some('-') => {
        if self.peek_char() == Some('-') { // --
            self.read_char();
            Token::Decrement
        } else if self.peek_char() == Some('=') { // -=
            self.read_char();
            Token::MinusAssign
        } else { // -
            Token::Minus
        }
    }

    Some('*') => {
        if self.peek_char() == Some('=') { // *=
            self.read_char();
            Token::AsteriskAssign
        } else {
            Token::Asterisk // *
        }
    }

    Some('/') => {
        if self.peek_char() == Some('=') { // /=
            self.read_char();
            Token::SlashAssign
        } else {
            Token::Slash // /
        }
    }

    // %, =, !, ... 등등

    Some(';') => Token::Semicolon,
    Some(',') => Token::Comma,
    Some('(') => Token::LParen,
    Some(')') => Token::RParen,
    Some('{') => Token::LBrace,
    Some('}') => Token::RBrace,
    Some('[') => Token::LBracket,
    Some(']') => Token::RBracket,

    // ..
}
```

Rust의 match문은 정말 유용하다.

-   사실 열심히 Rust를 공부했었는데 웹개발에는 더 편리한 프레임워크/언어들이 있는것같아, CS관련 프로젝트를 구현할때마다 Rust를 사용하려고 한다.

## 느낀 점

컴파일러를 구현하다보면 특이한 문법들이 많이 떠오르고 이 문법이 실제 통과할까? 하고 궁금해진 여러 케이스가 있었다. 예를 들면 `a+++b` 같은 구문은 어떻게 해석될지 궁금해 실제 C 컴파일러에서 실행해보기도 했었다. 이 외에도 여러 케이스에 대해서 테스트하며 lexer와 parser가 잘 동작할 수 있도록 했다.
처음부터 컴파일러를 Rust로 구현해 본 경험은 언어 처리 과정의 내부 구조를 깊이 이해하는 데 큰 도움이 되었다. 렉서와 파서를 직접 설계·코딩하며, 토큰 하나하나가 어떻게 의미 있는 구조로 변모하는지 체험할 수 있었다. 앞으로 남은 의미 분석부터 코드 생성 단계까지 차근차근 구현하면서, 컴파일러 전 과정에 대한 통합적인 시야를 갖추고 싶다.
