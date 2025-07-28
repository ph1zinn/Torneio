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
    rl.question('Digite o nome do torneio: ', (nome) => {
        rl.question('Digite o nome do jogo: ', (jogo) => {
            rl.question('Digite a data do torneio: (YYYY-MM-DD) ', (data) => {
                rl.question('Digite os nomes dos participantes: ', (participantes) => {
                    const torneio = {
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
} 