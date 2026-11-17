---
name: lecture-review
description: Review this repository's Korean lecture slides and speaker notes for matching IDs/order, clear teaching points, readable visuals, and correct reveal states. Use when reviewing or revising lecture material in this repository.
---

# 강의 자료 검토

1. 저장소의 `AGENTS.md`, README의 Lecture brief, 해당 슬라이드와 발표 노트에서 청중, 메시지, 시간 배분을 확인한다.
2. 저장소 루트에서 `node scripts/audit-lecture.mjs`를 실행한다. 슬라이드 ID 중복, 노트 번호, 슬라이드와 노트의 연결을 확인한다. 실패한 항목은 실제 덱 순서를 기준으로 수정한다.
3. 각 장의 중심 메시지가 하나인지, 한국 청중에게 익숙한 표현인지 살펴본다. 화면에는 발표를 따라갈 핵심만 남기고 자세한 설명과 출처는 노트에 둔다.
4. 공개된 제품 사례와 출처를 확인한다. 개인 경험이나 성과는 제공된 사실에 근거한다.
5. Playwright로 수정한 장의 시작·마지막·중간 단계를 데스크톱과 좁은 화면에서 확인한다. 글자와 이미지가 프레임을 벗어나는지, 역방향 이동과 `instant`에서도 공개 상태가 맞는지 살펴본다.
6. 앞뒤 장을 함께 보며 설명의 연결과 발표 시간을 점검한다. 변경 범위에 맞는 기존 검사를 실행하고, 확인한 내용과 남은 한계를 짧게 정리한다.

자동 점검 스크립트는 파일 연결을 검사한다. 사실 확인과 화면 검토는 별도로 수행한다.
