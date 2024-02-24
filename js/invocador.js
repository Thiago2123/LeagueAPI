
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
    console.log('data',data);
    
    if(data.status_code === 404){
        data.message = 'Dados não encontrados para o invocador com o riot Id '+nomeInvocador+' #'+tagInvocador;
        // $("#msg").html(data.message);
        mostrarMsg('msg', data.message)
        return false;
    }


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


function mostrarMsg(idCampo, msg, cor = 'danger', tempoSec = 4000 ){
    if (typeof msg !== 'string') {
        throw new Error('O parâmetro msg deve ser uma string.');
    }

    let alert = ` <div class="alert alert-${cor}" role="alert">${msg}</div>`

    $('#'+idCampo).append(alert);

}