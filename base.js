const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let torneios = [];

function menu() {
    console.log('\n<<<GERENCIAMENTO-DE-TORNEIOS>>>');
    console.log('1. Adicionar Torneio.');
    console.log('2. Listar Torneios.');
    console.log('3. Registrar Partida.');
    console.log('4. Listar Partidas e Classificação de um Torneio.');
    console.log('5. Filtrar Torneios por Jogo.');
    console.log('6. Remover Torneio.');
    console.log('7. Sair do Programa de Torneios.');
    console.log('='.repeat(30));

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
                console.log('Obrigado por usar nosso Programa. Até mais!');
                break;
            default:
                console.log('Opção inválida. Tente Novamente.');
                menu();
        }
    });
}

function adicionarTorneio() {
    rl.question('Digite um número para o ID do torneio: ', (idInput) => {
        const id = parseInt(idInput, 10);
        if (isNaN(id) || idInput.trim() === '') {
            console.log("ID inválido. Por favor, digite um número.");
            return adicionarTorneio();
        }

        if (torneios.some(t => t.id === id)) {
            console.log(`Já existe um torneio com o ID ${id}. Por favor, escolha outro ID.`);
            return adicionarTorneio();
        }

        rl.question('Digite o nome do torneio: ', (nome) => {
            if (nome.trim() === '') {
                console.log('Nome do torneio não pode ser vazio. Por favor, tente novamente.');
                return adicionarTorneio();
            }
            rl.question('Digite o nome do jogo: ', (jogo) => {
                if (jogo.trim() === '') {
                    console.log('Nome do jogo não pode ser vazio. Por favor, tente novamente.');
                    return menu();
                }
                rl.question('Digite a data do torneio (YYYY-MM-DD): ', (data) => {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
                        console.log('Formato de data inválido. Use YYYY-MM-DD.');
                        return menu();
                    }

                    const novoTorneio = {
                        id,
                        nome,
                        jogo,
                        data,
                        participantes: [],
                        partidas: [],
                        concluido: false
                    };
                    torneios.push(novoTorneio);
                    console.log(`\nTorneio "${novoTorneio.nome}" adicionado com sucesso!`);

                    coletarParticipantes(novoTorneio);
                });
            });
        });
    });
}

function coletarParticipantes(torneioAtual) {
    rl.question(`\nAdicione um participante para o torneio "${torneioAtual.nome}" (digite 'parar' para finalizar): `, (nomeParticipante) => {
        if (nomeParticipante.toLowerCase().trim() === 'parar') {
            if (torneioAtual.participantes.length === 0) {
                console.log('Nenhum participante adicionado. Por favor, adicione pelo menos um participante.');
                return coletarParticipantes(torneioAtual);
            }
            console.log(`\nTotal de ${torneioAtual.participantes.length} participantes adicionados ao torneio "${torneioAtual.nome}".`);
            return menu();
        }

        if (nomeParticipante.trim() === '') {
            console.log('Nome do participante não pode ser vazio. Tente novamente.');
            return coletarParticipantes(torneioAtual);
        }

        if (torneioAtual.participantes.includes(nomeParticipante.trim())) {
            console.log(`"${nomeParticipante.trim()}" já foi adicionado a este torneio.`);
            return coletarParticipantes(torneioAtual);
        }

        torneioAtual.participantes.push(nomeParticipante.trim());
        console.log(`"${nomeParticipante.trim()}" adicionado.`);
        coletarParticipantes(torneioAtual);
    });
}

function listarTorneios() {
    if (torneios.length === 0) {
        console.log('Não há torneios de E-Sports cadastrados.');
    } else {
        console.log(`\n=== TORNEIOS DE E-SPORTS CADASTRADOS ===`);
        torneios.forEach((torneio, index) => {
            const status = torneio.concluido ? 'Concluído' : 'Pendente';
            const totalParticipantes = torneio.participantes ? torneio.participantes.length : 0;
            console.log(
                `${index + 1}. ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo} | Status: ${status} \n` +
                `   Data: ${torneio.data} | Total de Participantes: ${totalParticipantes}`
            );
        });
    }

    console.log('\nPressione Enter para retornar ao menu anterior.');
    rl.question('', () => menu());
}

function registrarPartida() {
    if (torneios.length === 0) {
        console.log('Nenhum torneio registrado para registrar partidas.');
        console.log('\nPressione Enter para retornar ao menu...');
        return rl.question('', menu);
    }

    console.log('\n=== TORNEIOS DISPONÍVEIS PARA REGISTRAR PARTIDA ===');
    torneios.forEach((torneio, index) => {
        console.log(`${index + 1}. ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo}`);
    });

    rl.question('\nDigite o ID do torneio que deseja registrar a partida: ', (idInput) => {
        const idDoTorneio = parseInt(idInput, 10);
        const torneio = torneios.find(t => t.id === idDoTorneio);

        if (!torneio) {
            console.log('Esse torneio não existe!');
            console.log('\nPressione Enter para retornar ao menu...');
            return rl.question('', menu);
        }

        if (torneio.participantes.length < 2) {
            console.log(`Torneio "${torneio.nome}" precisa de pelo menos 2 participantes para registrar uma partida.`);
            console.log('\nPressione Enter para retornar ao menu...');
            return rl.question('', menu);
        }

        coletarDadosPartida(torneio);
    });
}

function coletarDadosPartida(torneio) {
    console.log(`\nTorneio selecionado: ${torneio.nome}`);
    console.log('Participantes registrados: ' + torneio.participantes.join(', '));

    rl.question('Informe o nome do Jogador 1 (deve ser um participante): ', (jogador1) => {
        if (!torneio.participantes.includes(jogador1.trim())) {
            console.log(`"${jogador1.trim()}" não é um participante registrado neste torneio. Tente novamente.`);
            return coletarDadosPartida(torneio);
        }

        rl.question('Informe o nome do Jogador 2 (deve ser um participante, diferente do Jogador 1): ', (jogador2) => {
            if (!torneio.participantes.includes(jogador2.trim())) {
                console.log(`"${jogador2.trim()}" não é um participante registrado neste torneio. Tente novamente.`);
                return coletarDadosPartida(torneio);
            }
            if (jogador1.trim() === jogador2.trim()) {
                console.log('Jogador 1 e Jogador 2 não podem ser a mesma pessoa. Tente novamente.');
                return coletarDadosPartida(torneio);
            }

            rl.question('Informe o nome do vencedor: ', (vencedor) => {
                if (vencedor.trim() !== jogador1.trim() && vencedor.trim() !== jogador2.trim()) {
                    console.log('O vencedor deve ser um dos jogadores informados. Por favor, tente novamente.');
                    return coletarDadosPartida(torneio);
                }

                const partida = {
                    jogador1: jogador1.trim(),
                    jogador2: jogador2.trim(),
                    vencedor: vencedor.trim(),
                    timestamp: new Date().toLocaleString()
                };

                torneio.partidas.push(partida);

                console.log('\nPartida registrada com sucesso!');
                console.log(`Partida: ${partida.jogador1} vs ${partida.jogador2}`);
                console.log(`Vencedor: ${partida.vencedor}`);

                console.log('\nPressione Enter para voltar ao menu...');
                rl.question('', () => menu());
            });
        });
    });
}

function listarPartidasDoTorneio() {
    if (torneios.length === 0) {
        console.log('Nenhum torneio registrado.');
        console.log('\nPressione Enter para retornar ao menu...');
        return rl.question('', menu);
    }

    console.log('\n=== TORNEIOS DISPONÍVEIS PARA CONSULTA ===');
    torneios.forEach((torneio, index) => {
        console.log(`${index + 1}. ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo}`);
    });

    rl.question('\nDigite o ID do torneio para listar as partidas e classificação: ', (idInput) => {
        const idDoTorneio = parseInt(idInput, 10);
        const torneio = torneios.find(t => t.id === idDoTorneio);

        if (!torneio) {
            console.log(`Torneio com ID ${idInput} não encontrado.`);
            console.log('\nPressione Enter para retornar ao menu...');
            return rl.question('', menu);
        }

        console.log(`\n--- PARTIDAS DO TORNEIO "${torneio.nome}" (ID: ${torneio.id}) ---`);
        if (torneio.partidas.length === 0) {
            console.log("Nenhuma partida registrada para este torneio.");
        } else {
            torneio.partidas.forEach((partida, index) => {
                console.log(`Partida ${index + 1}: ${partida.jogador1} vs ${partida.jogador2} | Vencedor: ${partida.vencedor} | Data/Hora: ${partida.timestamp}`);
            });
        }

        console.log(`\n--- CLASSIFICAÇÃO DO TORNEIO "${torneio.nome}" ---`);
        const pontuacoes = {};

        if (torneio.participantes && torneio.participantes.length > 0) {
             torneio.participantes.forEach(participante => pontuacoes[participante] = 0);
        } else {
            console.log("Nenhum participante registrado para este torneio, ou nenhum ponto foi marcado ainda.");
        }

        torneio.partidas.forEach(partida => {
            if (!pontuacoes.hasOwnProperty(partida.vencedor)) {
                pontuacoes[partida.vencedor] = 0;
            }
            pontuacoes[partida.vencedor]++;
        });

        const ranking = Object.entries(pontuacoes).sort(([, vitA], [, vitB]) => vitB - vitA);

        if (ranking.length === 0) {
            console.log("Nenhuma pontuação registrada ainda.");
        } else {
            ranking.forEach(([jogador, vitorias], index) => {
                console.log(`${index + 1}. ${jogador} - ${vitorias} vitórias`);
            });
        }

        console.log('\nPressione Enter para retornar ao menu...');
        rl.question('', () => menu());
    });
}

function filtrarTorneiosPorJogo() {
    if (torneios.length === 0) {
        console.log('Nenhum torneio registrado.');
        console.log('\nPressione Enter para retornar ao menu...');
        return rl.question('', menu);
    }

    rl.question('\nDigite o nome do jogo para filtrar os torneios: ', (nomeJogoBusca) => {
        if (nomeJogoBusca.trim() === '') {
            console.log('O nome do jogo não pode ser vazio.');
            console.log('\nPressione Enter para retornar ao menu...');
            return rl.question('', menu);
        }

        const torneiosFiltrados = torneios.filter(torneio =>
            torneio.jogo.toLowerCase().includes(nomeJogoBusca.toLowerCase())
        );

        if (torneiosFiltrados.length === 0) {
            console.log(`Nenhum torneio encontrado para o jogo "${nomeJogoBusca}".`);
        } else {
            console.log(`\n--- TORNEIOS DE "${nomeJogoBusca}" ---`);
            torneiosFiltrados.forEach(torneio => {
                console.log(`ID: ${torneio.id}`);
                console.log(`Nome: ${torneio.nome}`);
                console.log(`Data: ${torneio.data}`);
                console.log(`Total de Participantes: ${torneio.participantes.length}`);
                console.log("-------------------------");
            });
        }

        console.log('\nPressione Enter para retornar ao menu...');
        rl.question('', () => menu());
    });
}

function removerTorneio() {
  if (torneios.length === 0) {
      console.log('Nenhum torneio registrado para remover.');
      console.log('\nPressione Enter para retornar ao menu...');
      return rl.question('', menu);
  }

  console.log('\n=== TORNEIOS DISPONÍVEIS PARA REMOÇÃO ===');
  torneios.forEach((torneio, index) => {
      console.log(`${index + 1}. ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo} | Data: ${torneio.data}`);
  });

  rl.question('\nDigite o ID do torneio que deseja apagar: ', (idParaRemover) => {
      const idNumerico = parseInt(idParaRemover, 10);

      const index = torneios.findIndex(torneio => torneio.id === idNumerico);
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