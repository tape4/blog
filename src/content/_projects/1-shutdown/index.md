---
title: "침대에서 컴퓨터 끄기"
description: "방구석에서 누워서 휴대폰으로 컴퓨터 끄기"
date: "Oct 25 2024"
repoURL: "https://github.com/tape4/shutdown_on_packet"
---

## 개요

**침대에 누웠는데 컴퓨터 전원을 끄는 걸 깜빡한 순간**, "그냥 휴대폰으로 끌 수 있으면 좋겠다"는 생각으로 시작된 개인 프로젝트입니다. UDP 3333 포트를 수신 대기하는 C 프로그램과, 이를 systemd에 등록해 시스템 시작 시 자동 실행되도록 구성하는 설치 스크립트로 이루어져 있습니다. 스마트폰 앱을 통해 해당 포트로 패킷을 보내면, 컴퓨터가 자동으로 종료됩니다.

---

## 주요 구성

-   `shutdown_on_packet.c`: UDP 패킷을 수신하면 시스템을 종료하는 C 프로그램
-   `setup_shutdown_on_packet.sh`: 프로그램을 컴파일하고 systemd 서비스로 등록하는 자동화 설치 스크립트

---

## 사용 방법

1. **저장소 클론 또는 다운로드**

2. **실행 권한 부여**

    ```bash
    chmod +x setup_shutdown_on_packet.sh
    ```

3. **설치 스크립트 실행**
    ```bash
    sudo ./setup_shutdown_on_packet.sh
    ```

실행이 완료되면 컴퓨터가 부팅될 때 자동으로 해당 프로그램이 백그라운드에서 실행됩니다. 스마트폰에서 포트 포워딩을 통해 UDP 3333 포트로 패킷을 보내면 컴퓨터가 종료됩니다. 실제로 침대에서 스마트폰 앱 하나로 데스크탑 전원을 끌 수 있게 되어 매우 유용하게 사용하고 있습니다.
