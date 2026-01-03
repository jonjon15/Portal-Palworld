const { Rcon } = require('rcon-client');

const RCON_HOST = '201.93.248.252';
const RCON_PORT = 25575;
const RCON_PASSWORD = '060892';
const STEAM_ID = 'steam_76561198000866703';
const ITEM = 'Stone';
const QUANTITY = 1;

async function testCommand(command) {
  const rcon = new Rcon({
    host: RCON_HOST,
    port: RCON_PORT,
    password: RCON_PASSWORD,
  });

  try {
    console.log(`\n🔄 Testando: ${command}`);
    await rcon.connect();
    const response = await rcon.send(command);
    await rcon.end();
    console.log(`✅ SUCESSO! Resposta: ${response}`);
    return { success: true, command, response };
  } catch (error) {
    console.log(`❌ Falhou: ${error.message}`);
    try { await rcon.end(); } catch {}
    return { success: false, command, error: error.message };
  }
}

async function testAllCommands() {
  console.log('═══════════════════════════════════════════════');
  console.log('🧪 TESTANDO TODOS OS COMANDOS RCON DO PALWORLD');
  console.log('═══════════════════════════════════════════════');
  console.log(`Host: ${RCON_HOST}:${RCON_PORT}`);
  console.log(`Steam ID: ${STEAM_ID}`);
  console.log(`Item: ${ITEM} x${QUANTITY}`);
  
  const commands = [
    `GiveItem ${STEAM_ID} ${ITEM} ${QUANTITY}`,
    `GiveItemToPlayer ${STEAM_ID} ${ITEM} ${QUANTITY}`,
    `/GiveItem ${STEAM_ID} ${ITEM} ${QUANTITY}`,
    `/GiveItemToPlayer ${STEAM_ID} ${ITEM} ${QUANTITY}`,
    `giveitem ${STEAM_ID} ${ITEM} ${QUANTITY}`,
    `/give ${STEAM_ID} ${ITEM} ${QUANTITY}`,
    `give ${STEAM_ID} ${ITEM} ${QUANTITY}`
  ];

  const results = [];
  
  for (const command of commands) {
    const result = await testCommand(command);
    results.push(result);
    
    if (result.success) {
      console.log(`\n🎉 COMANDO QUE FUNCIONA ENCONTRADO!`);
      console.log(`📝 Use este comando: ${result.command}`);
      break;
    }
    
    // Aguardar 1 segundo entre tentativas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('📊 RESUMO DOS TESTES:');
  console.log('═══════════════════════════════════════════════');
  
  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${i + 1}. ${r.command}`);
  });

  const working = results.find(r => r.success);
  if (working) {
    console.log(`\n✨ COMANDO CORRETO: ${working.command}`);
  } else {
    console.log('\n⚠️ Nenhum comando funcionou. Verifique:');
    console.log('   - RCON está habilitado no servidor?');
    console.log('   - Porta 25575 está aberta?');
    console.log('   - Senha RCON está correta?');
  }
}

testAllCommands().catch(console.error);
