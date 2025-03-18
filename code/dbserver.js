//Node.js의 웹 프레임워크로, HTTP 서버를 쉽게 구축할 수 있도록 도와줍니다.
const express = require('express');
//MariaDB를 포함한 MySQL 데이터베이스와 연결할 수 있게 해주는 Node.js 라이브러리입니다.
//mysql2는 mysql의 후속 라이브러리로, 성능이 개선되었습니다.
const mysql = require('mysql2')
//Cross-Origin Resource Sharing을 위한 미들웨어로, 다른 도메인에서 API를 호출할 수 있도록 허용합니다.
//보통 프론트엔드와 백엔드가 다른 서버에서 실행될 때 필요합니다.
const cors = require('cors');

const app = express();
const PORT = 3000;


// CORS 설정
app.use(cors());
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'park',
    database: 'job'
});

db.connect(err => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('✅ DB 연결 성공');
    }
});

// CORS 설정 (Cross-Origin Resource Sharing)
app.use(cors());

// 'id_job'을 기준으로 플레이어 데이터를 조회하는 API 라우팅
app.get('/player/:id_job', (req, res) => {
  const playerId = req.params.id_job;  // URL에서 'id_job'을 추출

  // SQL 쿼리 실행
  db.query('SELECT * FROM ability WHERE id_job = ?', [playerId], (err, result) => {
    if (err) {
      console.error('DB 조회 오류:', err);
      res.status(500).json({ error: 'DB 조회 오류' });
      return;
    }

    if (result.length > 0) {
      // 해당 id_job에 맞는 플레이어 데이터가 존재하면 JSON으로 응답
      res.json(result[0]);
    } else {
      // 데이터가 없다면 404 상태 코드와 함께 'Player not found' 메시지 응답
      res.status(404).json({ message: 'Player not found' });
    }
  });
});

// 서버 실행
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 서버 실행 중: http://0.0.0.0:${PORT}`);
});