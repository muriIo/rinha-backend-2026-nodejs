import { createServer } from 'node:http';

interface TransactionPayload {
  id: string;
  transaction: {
    amount: number;
    installments: number;
    requested_at: string;
  },
  customer: {
    avg_amount: number;
    tx_count_24h: number;
    known_merchants: string[];
  },
  merchant: {
    id: string;
    mcc: string;
    avg_amount: number;
  },
  terminal: {
    is_online: boolean;
    card_present: boolean;
    km_from_home: number;
  },
  last_transaction: {
    timestamp: string;
    km_from_current: number;
  }
};

interface ResultPayload {
  approved: boolean;
  fraud_score: number;
}

const PORT = 3000;
const JSON_HEADERS = { 'Content-Type': 'application/json' };
const server = createServer((req, res) => {
  const { url, method } = req;

  if (url === '/ready' && method === 'GET') {
    //Verificação de prontidão. A sua API deve responder com HTTP 2xx 
    // quando estiver pronta para receber requisições e ser testada.

    res.writeHead(200);
    res.end('OK');

    return;
  }

  if (url === '/fraud-score' && method === 'POST') {
    // Este é o endpoint responsável pela detecção de fraudes.
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const raw = chunks.length === 1 ? chunks[0]! : Buffer.concat(chunks);
      const body = JSON.parse(raw.toString()) as TransactionPayload;

      const result: ResultPayload = { approved: false, fraud_score: 1.0 };

      res.writeHead(200, JSON_HEADERS);
      res.end(result);
    });

    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);
});