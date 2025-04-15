---
title: "Spring CI/CD Template"
description: "EC2 환경에서 Spring Boot 프로젝트를 위한 무중단 배포 + 모니터링 템플릿"
date: "Apr 15 2025"
repoURL: "https://github.com/tape4/spring-cicd-template"
---

## 소개

Spring 프로젝트를 여러 번 진행하면서, 제한된 리소스(AWS EC2 프리티어) 환경과 반복되는 요구사항 속에서 템플릿의 필요성을 느껴 직접 만든 **CI/CD 자동화 및 모니터링 템플릿**이다.  
Spring Boot, Nginx, MariaDB, Redis, Grafana, Prometheus, Loki를 모두 Docker 기반으로 구성하고, 스크립트 실행 단 한번만으로도 무중단 롤링 업데이트까지 지원한다.  
개인 프로젝트나 사이드 프로젝트에서 손쉽게 배포 및 운영 자동화를 시작할 수 있도록 설계했다.

---

## 시스템 구성도

### 📦 전체 인프라 구성

![diagram](/cicd-mermaid.png)

---

## 주요 기능

-   **CI/CD 자동화**: GitHub Actions로 Docker 이미지를 빌드하고, 스크립트를 통해 롤링 업데이트 수행
-   **무중단 배포**: Spring App #1, #2를 번갈아 배포하여 서비스 중단 없이 업데이트
-   **모니터링 스택**: Prometheus, Grafana, Loki로 실시간 메트릭 및 로그 시각화
-   **Nginx 로드밸런싱 및 상태 확인**: `/status`, `/grafana` 경로 제공
-   **Docker 기반 통합 인프라**: MariaDB, Redis 포함

---

## 프로젝트 구조

```
.
├── nginx/                 # Nginx 설정
├── grafana/               # 모니터링 설정 (Grafana, Prometheus, Loki)
├── rolling_update/        # 롤링 업데이트 스크립트
├── scripts/               # 실행/종료 스크립트 모음
├── storage/               # DB/Redis 설정
└── .env.template          # 환경 변수 템플릿
```

---

## 사용 방법 요약

```bash
# 환경 설정
cp .env.template .env

# 권한 부여
chmod +x scripts/*.sh
chmod +x rolling_update/*.sh

# 인프라 시작
./scripts/all-infra-launch.sh

# 롤링 업데이트
./rolling_update/rolling-update.sh
```

---

## 느낀 점

이 템플릿을 만들면서, 단순히 코드를 작성하는 것뿐만 아니라 서비스가 **운영되는 환경까지 고려하는 것**의 중요함을 크게 느꼈다. CI/CD, 모니터링, 무중단 배포 등은 개발자에게 더 이상 선택이 아닌 필수적인 역량이 되었고, 제한된 리소스 안에서도 충분히 실용적인 인프라를 구축할 수 있다는 것을 직접 경험할 수 있었다.

반복 가능한 작업을 자동화하는건 항상 즐겁다.

특히 프로젝트와 별개로, HTTPS 환경을 구성하면서 [**AWS의 Public IPv4 정책 변경**](https://aws.amazon.com/ko/blogs/korea/new-aws-public-ipv4-address-charge-public-ip-insights/)으로 인해 기존에 사용하던 AWS Certificate Manager와 Load Balancer를 통한 무료 인증서 방식이 유료화되었다.  
이에 따라 **Nginx와 Certbot을 이용한 무료 인증서 발급 및 갱신 방식으로 구조를 변경**하였으며, 이 부분에 대해서도 템플릿에 추후 반영할 예정이다.
