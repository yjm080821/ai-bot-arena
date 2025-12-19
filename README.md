# Neon Strike

---

## 프로젝트 개요

이 프로젝트는 **웹 브라우저에서 실행되는 1인칭 FPS(Firsr-Person Shooter) 게임 프로토타입**입니다.  
React와 TypeScript, Three.js를 활용하여 별도의 게임 엔진 없이 **웹 기술만으로 FPS의 핵심 요소**를 구현하는 것을 목표로 합니다.

플레이어는 1인칭 시점에서 이동 및 사격을 수행하며,  
정해진 수의 적을 모두 처치하면 게임이 종료되는 구조로 설계되었습니다.

---

## 주요 기능

- 1인칭 카메라 시점 (Pointer Lock API 사용)
- WASD 이동
- 마우스 클릭을 통한 사격
- Raycast 기반 피격 판정
- 적 체력 시스템 및 사망 처리
- 정해진 적 전부 처치 시 게임 클리어 처리
- 남은 적 수를 표시하는 간단한 HUD UI

---

## 사용 기술

- Frontend: React, TypeScript
- 3D Rendering: Three.js
- Web API: Pointer Lock API, Keyboard & Mouse Events
- Deployment: Vercel
- Platform: v0.app

---

## 배운 점

- 웹 환경에서 Three.js를 활용한 3D 씬 구성 방법 이해
- Pointer Lock API를 이용한 FPS 카메라 제어 방식 학습
- React와 게임 루프 로직을 분리하여 관리하는 구조 설계 경험
- 웹 기술만으로도 간단한 FPS 게임 구조를 구현할 수 있음을 확인
