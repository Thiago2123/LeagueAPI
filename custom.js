
// CASO TENHA HEADERS NA REQUISIÇÃO DA API 
    // const headerAPI = new Headers({
    //     "Access-Control-Allow-Origin": "*"
    
    // });

    
// SIDEBAR
let sidebar = document.querySelector(".sidebar");
let bars = document.querySelector(".bars");

bars.addEventListener("click", function() {
    sidebar.classList.contains("active") ? sidebar.classList.remove("active") :
    sidebar.classList.add("active");
});


const requestApi = {
    baseApi:"https://br1.api.riotgames.com",
    apiKey: "RGAPI-386bb88e-9b98-41fc-97eb-c45f65eaca7c",
    // nome: "nhamih"
};


let id_cripitografado;

function fazGet(url){
    console.log(url);
    let request = new XMLHttpRequest();

    try {
        request.open("GET", url, false);
        // // Definindo cabeçalhos a partir da variável headerAPI
        // for (const [header, value] of headerAPI.entries()) {
        //     request.setRequestHeader(header, value);
        // }        
        
        request.send();


        if (request.status = 200) {
            return request.responseText;
        }else{
            return {erro: '403', msg: 'Nome não encontrado'};
        }
        
        
    } catch (error) {
        console.error("Erro na requisição: " + error);
        return null;
    }
   
    
}

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
        console.log(partidaAtiva);
    
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





let box_img = document.getElementById('box-img');
fetch('https://ddragon.leagueoflegends.com/cdn/14.3.1/data/pt_BR/champion.json')
  .then(response => response.json()) // Transforma a resposta em JSON
  .then(data => {
    const champions = data;

    for(const key in champions.data){
        let dadoImg = document.createElement('img');
        dadoImg.setAttribute("data-bs-toggle","modal");
        dadoImg.setAttribute('data-bs-target',"#modalChampion");
        dadoImg.setAttribute('id', key);
        dadoImg.setAttribute('onclick', 'abrirModalChampion("'+key+'")');

        dadoImg.src = "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/"+key+".png";
        box_img.appendChild(dadoImg);
    }
    // console.log(champions);
    
}).catch(error => {
console.error('Ocorreu um erro ao obter o JSON de campeoes:', error);
});



function abrirModalChampion(champion){
    // alert(champion);
    let tituloModalChampion = document.getElementById('tituloModalChampion');
    let imgModalChampion = document.getElementById('imgModalChampion');
    let loreModalChampion = document.getElementById('loreModalChampion');
    let subTitleModalChampion = document.getElementById('subTitleModalChampion');
    let divSkinsModalChampion = document.getElementById('divSkinsModalChampion');

    divSkinsModalChampion.innerHTML = '';
    let loreTab = document.getElementById('pills-lore-tab');
    loreTab.click();

    fetch('https://ddragon.leagueoflegends.com/cdn/14.3.1/data/pt_BR/champion/'+champion+'.json')
        .then(response => response.json())
        .then(data => {
            championDetails = data.data[champion];
            tituloModalChampion.innerHTML = championDetails.name;
            imgModalChampion.src = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champion+"_0.jpg";
            loreModalChampion.innerHTML = championDetails.lore;
            subTitleModalChampion.innerHTML = championDetails.name + " " + championDetails.title;



            for(const key in championDetails.skins){
                let numSkin = championDetails.skins[key].num;
                let divSkinImg = document.createElement('div');
                let dadoSkinImg = document.createElement('img');

                divSkinImg.appendChild(dadoSkinImg);

                dadoSkinImg.src = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champion+"_"+numSkin+".jpg";
                divSkinsModalChampion.appendChild(divSkinImg);
                console.log("numskins",numSkin);
            }



            console.log(championDetails);          


    }).catch(error => {
            console.error('Ocorreu um erro ao obter o JSON de campeoes:', error);
    });

}