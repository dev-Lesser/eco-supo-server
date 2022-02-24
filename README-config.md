### Configuration
- 개발 환경에 따른 코드

#### 설정파일
- xml, json, yaml, env var 등

#### 환경변수
- 윈도우의 경우 win-node-env 설치
```bash
yarn add global win-node-env 
```

- config 모듈 
```bash
yarn add config
```
---
### config 모듈을 이용한 설정 파일 생성
- root dir 에서 ```config/default|development|production.yml``` 파일 생성
```
yarn add config
```

- 사용법
```typescript
import * as config from 'config'
```
- yml 파일 git ignore 처리
```yaml
server:
  port: 3000

db:
  type: 'postgres'
  port: 5438
  database: board-app

jwt:
  expiresIn: 3600
```