
const requestApi = {
    baseApi:"https://br1.api.riotgames.com",
    apiKey: "RGAPI-b33bec25-bf18-4b6e-bc15-47142874c034",
    // nome: "nhamih"
};







function procurarInvocador(){
    const nomeInvocador = $('#input_nome').val();
    const tagInvocador = $('#input_tag').val();

    var data = fazGet('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/'+nomeInvocador+'/'+tagInvocador+'?api_key='+requestApi.apiKey+'');
    // data = fazGet('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/thiago2123/br1?api_key=RGAPI-b33bec25-bf18-4b6e-bc15-47142874c034');
    // console.log('data',data.puuid);
    
    if(data.status_code === 404){
        data.message = 'Dados não encontrados para o invocador com o riot Id '+nomeInvocador+' #'+tagInvocador;
        // $("#msg").html(data.message);
        mostrarMsg('msg', data.message, 4)
        return false;
    }

    return data.puuid

} 


function buscarDadosInvocador(){
    const puuid = procurarInvocador();
    var data = fazGet(requestApi.baseApi+'/lol/summoner/v4/summoners/by-puuid/'+puuid+'?api_key='+requestApi.apiKey+'');
    console.log(data);

    $("#imgInvocador").attr('src', 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/'+data.profileIconId+'.png');

    $("#invocadorLvl").html(data.summonerLevel);
    $("#rowInvocador").removeClass('d-none');
}







let id_cripitografado;
function pegarIdSummoner(){
    const input_nome = document.querySelector("#input_nome").value;
    data = fazGet(requestApi.baseApi+'/lol/summoner/v4/summoners/by-name/'+input_nome+'?api_key='+requestApi.apiKey+'');
    
    if(data != null){
        usuario = JSON.parse(data);
        console.log("PEGOU ID: ", usuario.id);
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
        console.log(partidaAtiva.status.status_code);

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