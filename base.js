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
                rl.question('Digite os nomes dos participantes: ', (participantes) => {
                    const torneio = {
                        id,
                        nome,
                        jogo,
                        data,
                        participantes,
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

// O missoes esta funcionando agora
menu();
