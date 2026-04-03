// Teste básico do servidor
console.log('Starting server test...');

try {
  const express = await import('express');
  const cors = await import('cors');
  
  const app = express.default();
  app.use(cors.default());
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is working!' });
  });
  
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
  
} catch (error) {
  console.error('❌ Error starting server:', error);
}
