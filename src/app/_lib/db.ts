import { createPool} from 'mysql2';

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10, // 최대 연결 수 제한
    queueLimit: 0 // 대기열 제한 없음
});

export const executeQuery = async (query: string, values: any[] = []) => {
    // 쿼리 실행 및 에러 처리
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            return reject(error); // 에러 발생 시 Promise reject
        }
        resolve(results); // 성공 시 Promise resolve
        });
    });
}