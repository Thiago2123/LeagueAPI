
const requestApi = {
    baseApi:"https://br1.api.riotgames.com",
    baseApiAmerica:"https://americas.api.riotgames.com",
    apiKey: "RGAPI-b33bec25-bf18-4b6e-bc15-47142874c034",
};


function procurarInvocador(){
    const nomeInvocador = $('#input_nome').val();
    const tagInvocador = $('#input_tag').val();
    // console.log('nomeInvocador', nomeInvocador);

    // verificar se os campos estão em branco
    if(nomeInvocador === '' || tagInvocador === ''){
        var campoNome = $('#input_nome').attr('nomeCampo');
        var campoTag = $('#input_tag').attr('nomeCampo');
        mostrarMsg('msg', "O campo <b>"+(nomeInvocador === '' ? campoNome : campoTag)+"</b> está vazio", 4)
        return false
    }

    var data = fazGet('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/'+nomeInvocador+'/'+tagInvocador+'?api_key='+requestApi.apiKey+'');
    // console.log('data',data.puuid);
    
    if(data.status_code === 404){
        data.message = 'Dados não encontrados para o invocador com o riot Id '+nomeInvocador+' #'+tagInvocador;
        // $("#msg").html(data.message);
        mostrarMsg('msg', data.message, 4)
        return false;
    }

    return {'puuid': data.puuid, 'tag': data.tagLine};

} 


function buscarDadosInvocador(){
    const versaoAPI = verificaUltimaVersaoV2();
    const nomeInvocador = procurarInvocador();
    if(nomeInvocador){
        var data = fazGet(requestApi.baseApi+'/lol/summoner/v4/summoners/by-puuid/'+nomeInvocador.puuid+'?api_key='+requestApi.apiKey+'');
        
        const idPartidas = buscarIdsPartidaDoHistorico(data.puuid);
        const posicoesJogadas = buscarDadosDaPartida(idPartidas, data.puuid);

        console.log('posicoesJogadas', posicoesJogadas);
        // console.log('buscarDadosInvocador', data);

        $("#imgInvocador").attr('src', 'https://ddragon.leagueoflegends.com/cdn/'+versaoAPI+'/img/profileicon/'+data.profileIconId+'.png');
        $("#spanInvocadorLvl").html(data.summonerLevel);
        $("#nomeInvocador").html(`<h3><strong>${data.name}</strong><span> #${nomeInvocador.tag} </span</h3>`);
        
        
        $("#rowInvocador").removeClass('d-none');
        
        $("#textBarraDeContagem").text(`Posições mais jogadas nas em ${idPartidas.length} partidas`);

        $("#progressBarTop").css('height', `${(posicoesJogadas.top / idPartidas.length) * 100}%`).text(posicoesJogadas.top);
        $("#progressBarJg").css('height', `${(posicoesJogadas.jg / idPartidas.length) * 100}%`).text(posicoesJogadas.jg);
        $("#progressBarMid").css('height', `${(posicoesJogadas.mid / idPartidas.length) * 100}%`).text(posicoesJogadas.mid);
        $("#progressBarAdc").css('height', `${(posicoesJogadas.adc / idPartidas.length) * 100}%`).text(posicoesJogadas.adc);
        $("#progressBarSup").css('height', `${(posicoesJogadas.sup / idPartidas.length) * 100}%`).text(posicoesJogadas.sup);
      

        return data.id;
    }else{
        $("#rowInvocador").addClass('d-none');
        return false;
    }

}

function buscarDadosRanked() {
    const idSummoner = buscarDadosInvocador();
    if(idSummoner){
        $("#textRankedSolo, #textRankedFlex, #textRankedFlexPdl, #textRankedSoloPdl").html("");
        $("#imgRankedFlex, #imgRankedSolo").attr("src", "");
        
        var ranqueadas = fazGet(requestApi.baseApi+'/lol/league/v4/entries/by-summoner/'+idSummoner+'?api_key='+requestApi.apiKey+'');
        // console.log('ranqueadas', ranqueadas);
        
        if (ranqueadas.length == 0) {
            $("#textRankedSolo, #textRankedFlex").html("Unranked").addClass('unranked');

        } else {
            $("#textRankedSolo, #textRankedFlex").removeClass('unranked');
            let soloRanked = false;
            let flexRanked = false;

            ranqueadas.forEach(function(rank) {
                // console.log('rank', rank);
                
                if (rank.queueType === "RANKED_SOLO_5x5") {
                    $("#imgRankedSolo").attr('src', 'imgs/emblemas/Rank='+rank.tier+'.png');
                    rank.tier = traduzirTier(rank.tier);
                    $("#textRankedSolo").html(rank.tier + " "+ rank.rank);
                    $("#textRankedSoloPdl").html(rank.leaguePoints + " LP");
                    $("#textRankedSoloWinLose").html(rank.wins + " V " + rank.losses + " L");

                    
                    $("#textRankedSoloWinrate").html("Winrate "+calcularWinRate(rank.wins, rank.losses)+"%");
                    soloRanked = true;
                }
                if (rank.queueType === "RANKED_FLEX_SR") {
                    $("#imgRankedFlex").attr('src', 'imgs/emblemas/Rank='+rank.tier+'.png');
                    rank.tier = traduzirTier(rank.tier);
                    $("#textRankedFlex").html(rank.tier + " "+ rank.rank);
                    $("#textRankedFlexPdl").html(rank.leaguePoints + " LP");
                    $("#textRankedFlexWinLose").html(rank.wins + " V " + rank.losses + " L");

                    $("#textRankedFlexWinrate").html("Winrate "+calcularWinRate(rank.wins, rank.losses)+"%");
                    flexRanked = true;
                }
            });

            if (!soloRanked) {
                $("#textRankedSolo").html("Unranked").addClass('unranked');
            }
            if (!flexRanked) {
                $("#textRankedFlex").html("Unranked").addClass('unranked');
            }
        }

        
        // console.log('ranqueadas ', ranqueadas);
    }
}

function traduzirTier(tier) {
    switch (tier) {
        case "IRON":
            return "Ferro";
        case "BRONZE":
            return "Bronze";
        case "SILVER":
            return "Prata";
        case "GOLD":
            return "Ouro";
        case "PLATINUM":
            return "Platina";
        case "EMERALD":
            return "Esmeralda";
        case "DIAMOND":
            return "Diamante";
        case "MASTER":
            return "Mestre";
        case "GRANDMASTER":
            return "Grão Mestre";
        case "CHALLENGER":
            return "Desafiante";
        default:
            return tier;
    }
}



let id_cripitografado;
function pegarIdSummoner(){
    const input_nome = document.querySelector("#input_nome").value;
    data = fazGet(requestApi.baseApi+'/lol/summoner/v4/summoners/by-name/'+input_nome+'?api_key='+requestApi.apiKey+'');
    
    if(data != null){
        usuario = JSON.parse(data);
        // console.log("PEGOU ID: ", usuario.id);
        id_cripitografado = usuario.id;
        return id_cripitografado;
    }else{
        // console.log('Erro: Não foi possível pegar o ID');
        return {erro: '404', msg: 'Não foi possível pegar o ID pelo nome do invocador'};
    }
    

}

function pegarPartidaOnline(){
    let id_cripitografado  = pegarIdSummoner();

    if(typeof id_cripitografado != 'object'){
        let tabelaTitulo = document.getElementById('tabela_titulo');
        let tabelaDado = document.getElementById('tabela_dado');
        
        pegarPartidaAtiva = fazGet(requestApi.baseApi+'/lol/spectator/v4/active-games/by-summoner/'+id_cripitografado+'?api_key='+requestApi.apiKey+'');
        partidaAtiva = JSON.parse(pegarPartidaAtiva);
        // console.log(partidaAtiva.status.status_code);

        if(partidaAtiva.status.status_code != 200){
           $("#msg").html(partidaAtiva.status.message);
        }
    
        for (const key in partidaAtiva) {
            if (partidaAtiva.hasOwnProperty(key)) {
                let tituloColuna = document.createElement('td');
                tituloColuna.textContent = key;
                tabelaTitulo.appendChild(tituloColuna);
    
                let dadoColuna = document.createElement('td');
                dadoColuna.textContent = partidaAtiva[key];
                tabelaDado.appendChild(dadoColuna);
            }
        }
    }else{
        let msg = document.getElementById('msg');
        msg.innerHTML = id_cripitografado.msg;
        // console.log(id_cripitografado)

    }

    
}


function calcularWinRate(vitorias, derrotas){
    const totalJogos = vitorias + derrotas;
    const winrate = (vitorias / totalJogos) * 100;
    const winrateArredondado = Math.round(winrate); // pegar apenas os dois numeros antes da virgula 
    // console.log('winrate', winrateArredondado); 
    return winrateArredondado;
}




function mostrarMsg(idCampo, msg, tempoSec = 3, cor = 'danger'){
    if (typeof msg !== 'string') {
        throw new Error('O parâmetro msg deve ser uma string.');
    }

    let alert = ` <div class="mt-2 alert alert-${cor}" role="alert">${msg}</div>`

    
    $('#'+idCampo).append(alert);
    setTimeout(() => {
        $('#'+idCampo).html("");
    }, tempoSec * 1000);
}
