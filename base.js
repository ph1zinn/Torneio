const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let torneios = [];

function menu () {
    console.log('<<<GERENCIAMENTO-DE-TORNEIOS>>>');
    console.log('1. Adicionar Torneio.');
    console.log('2. Listar Torneios.');
    console.log('3. Registrar Partida');
    console.log('4. Listar Partidas de um Torneio.');
    console.log('5. Filtar Torneios por Jogo.');
    console.log('6. Remover Torneio.');
    console.log('7. Sair do Programa de Torneios.');
    console.log('\n' + '='.repeat(30));

    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                adicionarTorneio();
                break;
            case '2':
                listarTorneios();
                break;
            case '3':
                registrarPartida();
                break;
            case '4':
                listarPartidasDoTorneio();
                break;
            case '5':
                filtrarTorneiosPorJogo();
                break;
            case '6':
                removerTorneio();
                break;
            case '7':
                rl.close();
                console.log('Obrigada por usar nosso Programa. Até mais!!');
                break;
            default:
                console.log('Opção inválida. Tente Novamente.');
                menu();
        }
    })
}

function adicionarTorneio() {
    rl.question('Digite um número para o ID do torneio: ', (id) => {
    rl.question('Digite o nome do torneio: ', (nome) => {
        rl.question('Digite o nome do jogo: ', (jogo) => {
            rl.question('Digite a data do torneio: (YYYY-MM-DD) ', (data) => {
                rl.question('Digite o nome do jogador 1', (jogador1) => {
                  rl.question('Digite o nome do jogador 2', (jogador2) => {
                    const torneio = {
                        id,
                        nome,
                        jogo,
                        data,
                        jogador1,
                        jogador2,
                    };
                    torneios.push(torneio);
                    console.log('Seu torneio foi adicionado com sucesso!!')
                    rl.question('Deseja adicionar outro torneio? (s/n): ', (resposta) => {
                        resposta.toLowerCase() === 's'
                        ? adicionarTorneio()
                        : menu();
                    })
                })
            })
        })
    })
})    
})
} 

// Função exibir torneios
// Listar torneios - mostrar todos os torneios cadastrados (ID, nome, jogo, data, total de participantes)

function listarTorneios() {
  if (torneios.length === 0) {
    console.log('Não há torneios de E-Sports cadastrados.');
  } else {
    console.log(`\n   TORNEIOS DE E-SPORTS   `);
    torneios.forEach((torneio, index) => {
      const status = torneio.concluido ? 'Concluído' : 'Pendente';
      console.log(
        `${index + 1}. ID: ${torneio.id} | Nome: ${torneio.nome} | Status: ${status} 
        | Data: ${torneio.data} | Total de jogadores: ${torneio.jogadores}`
      );
    });
  }
  
  console.log('\nPressione Enter para retornar ao menu anterior.');
  rl.question('', () => menu());
}

// Função para registrar a partida

function registrarPartida() {
  rl.question('\nDigite o ID do torneio que deseja registrar a partida: ', (num) => {
    const idDoTorneio = parseInt(num, 10);
    const torneio = torneios.find(t => t.id === idDoTorneio);

    if (!torneio) {
      console.log('Esse torneio não existe!');
      return menu();
    }

    coletarDadosPartida(torneio);
  });
}

function coletarDadosPartida(torneio) {
  rl.question(`\nTorneio selecionado: ${torneio.nome}\nInforme o nome do Jogador 1: `, (jogador1) => {
    rl.question('Informe o nome do Jogador 2: ', (jogador2) => {
      rl.question('Informe o nome do vencedor: ', (vencedor) => {
        if (vencedor !== jogador1 && vencedor !== jogador2) {
          console.log('O vencedor deve ser um dos jogadores informados. Por favor, tente novamente.');
          return coletarDadosPartida(torneio);
        }

        const partida = {
          jogador1: jogador1,
          jogador2: jogador2,
          vencedor: vencedor,
          timestamp: new Date().toISOString()
        };

        torneio.partidas.push(partida);

        console.log('\nPartida registrada com sucesso!');
        console.log(`Partida: ${jogador1} vs ${jogador2}`);
        console.log(`Vencedor: ${vencedor}`);
        
        console.log('\nPressione Enter para voltar ao menu...');
        rl.question('', () => menu());
      });
    });
  });
}

@param {number} idTorneio.
 
 function listarPartidasDoTorneio (idTorneio) {
    const torneio = torneios.find(t => t.id === idTorneio); // Encontra o torneio pelo ID
    if (!torneio) {
        console.log(`Torneio com ID ${idTorneio} não encontrado.`);
        return;
    }
    console.log(`\n--- PARTIDAS DO TORNEIO "${torneio.nomeTorneio}" (ID: ${torneio.id}) ---`);
    if (torneio.partidas.length === 0) {
        console.log("Nenhuma partida registrada para este torneio.");
    } else {
        torneio.partidas.forEach((partida, index) => { // Percorre e lista cada partida do torneio
            console.log(`Partida ${index + 1}: ${partida.jogador1} vs ${partida.jogador2} | Vencedor: ${partida.vencedor} | Data/Hora: ${partida.timestamp}`);
        });
    }

    console.log(`\n--- CLASSIFICAÇÃO DO TORNEIO "${torneio.nomeTorneio}" ---`);
    const pontuacoes = {}; // Um objeto para guardar as vitórias de cada jogador (ex: { "Alice": 3, "Bob": 1 })

    // Inicializa a pontuação de todos os participantes com 0 vitórias
    torneio.participantes.forEach(participante => pontuacoes[participante] = 0);

    // Percorre todas as partidas do torneio
    torneio.partidas.forEach(partida => {
        // Se o vencedor da partida existir na nossa lista de pontuações, incrementa sua vitória
        if (pontuacoes.hasOwnProperty(partida.vencedor)) {
            pontuacoes[partida.vencedor]++;
        }
    });

    // Converte as pontuações em um array de arrays (ex: [["Alice", 3], ["Bob", 1]])
    // e ordena em ordem decrescente de vitórias (o maior vem primeiro)
    const ranking = Object.entries(pontuacoes).sort(([, vitAlice], [, vitBob]) => vitBob - vitAlice);

    if (ranking.length === 0) {
        console.log("Nenhuma pontuação registrada ainda.");
    } else {
        ranking.forEach(([jogador, vitorias], index) => { // Percorre o ranking e exibe a posição, nome e vitórias
            console.log(`${index + 1}. ${jogador} - ${vitorias} vitórias`);
        });
    }
  }


 @param {string} nomeJogo - //O nome do jogo para filtrar.
 
function filtrarTorneiosPorJogo(nomeJogo) {
  // Filtra a lista 'torneios', mantendo apenas aqueles cujo 'nomeJogo' é igual ao que foi informado (ignorando maiúsculas/minúsculas)
  const torneiosFiltrados = torneios.filter(torneio => torneio.nomeJogo.toLowerCase() === nomeJogo.toLowerCase());

  if (torneiosFiltrados.length === 0) { // Se nenhum torneio for encontrado com esse jogo
      console.log(`Nenhum torneio encontrado para o jogo selecionado "${nomeJogo}".`);
      return;
  }

  console.log(`\n--- TORNEIOS DE "${nomeJogo}" ---`);
  torneiosFiltrados.forEach(torneio => { // Percorre e exibe os detalhes dos torneios filtrados
      console.log(`ID: ${torneio.id}`);
      console.log(`Nome: ${torneio.nomeTorneio}`);
      console.log(`Data: ${torneio.dataJogo}`);
      console.log(`Total de Participantes: ${torneio.participantes.length}`);
      console.log("-------------------------");
  });
}

function removerTorneio() {
  if (torneios.length === 0) {
      console.log('Nenhum torneio registrado para remover.');
      console.log('\nPressione Enter para retornar ao menu...');
      return rl.question('', menu);
  }

  console.log('\n=== TORNEIOS DISPONÍVEIS ===');
  torneios.forEach((torneio, index) => {
      console.log(`${index + 1}. ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo} | Data: ${torneio.data}`);
  });

  rl.question('\nDigite o ID do torneio que deseja apagar: ', (idParaRemover) => {

      const idNumerico = parseInt(idParaRemover, 10);

      const index = torneios.findIndex(torneio => torneio.id == idNumerico);
      if (index !== -1) {
          const [removido] = torneios.splice(index, 1);
          console.log(`Torneio "${removido.nome}" (ID: ${removido.id}) foi removido com sucesso!`);
      } else {
          console.log('ID do torneio inválido ou não encontrado!');
      }

      console.log('\nPressione Enter para voltar ao menu...');
      rl.question('', menu);
  });
}

menu();
