// Test RCON ShowPlayers
const { Rcon } = require('rcon-client');

async function testShowPlayers() {
  const rcon = new Rcon({
    host: '201.93.248.252',
    port: 25575,
    password: '060892'
  });

  try {
    await rcon.connect();
    console.log('✅ Conectado ao RCON');

    const response = await rcon.send('ShowPlayers');
    console.log('\n📋 Resposta ShowPlayers:');
    console.log('---');
    console.log(response);
    console.log('---');
    
    console.log('\n📊 Análise:');
    console.log('Length:', response.length);
    console.log('Lines:', response.split('\n'));
    
    const lines = response.split('\n').filter(l => l.trim());
    console.log('\n✨ Lines (filtered):', lines);
    
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',');
      console.log(`Line ${i}:`, lines[i]);
      console.log(`  Parts (${parts.length}):`, parts);
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await rcon.end();
  }
}

testShowPlayers();
