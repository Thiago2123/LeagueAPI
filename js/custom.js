
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

// function pegarIdSummoner(){
//     const input_nome = document.querySelector("#input_nome").value;
//     data = fazGet(requestApi.baseApi+'/lol/summoner/v4/summoners/by-name/'+input_nome+'?api_key='+requestApi.apiKey+'');
    
//     if(data != null){
//         usuario = JSON.parse(data);
//         // console.log("PEGOU ID: ", usuario.id);
//         id_cripitografado = usuario.id;
//         return id_cripitografado;
//     }else{
//         // console.log('Erro: Não foi possível pegar o ID');
//         return {erro: '404', msg: 'Não foi possível pegar o ID pelo nome do invocador'};
//     }
    

// }

// function pegarPartidaOnline(){
//     let id_cripitografado  = pegarIdSummoner();

//     if(typeof id_cripitografado != 'object'){
//         let tabelaTitulo = document.getElementById('tabela_titulo');
//         let tabelaDado = document.getElementById('tabela_dado');
        
//         pegarPartidaAtiva = fazGet(requestApi.baseApi+'/lol/spectator/v4/active-games/by-summoner/'+id_cripitografado+'?api_key='+requestApi.apiKey+'');
//         partidaAtiva = JSON.parse(pegarPartidaAtiva);
//         console.log(partidaAtiva);
    
//         for (const key in partidaAtiva) {
//             if (partidaAtiva.hasOwnProperty(key)) {
//                 let tituloColuna = document.createElement('td');
//                 tituloColuna.textContent = key;
//                 tabelaTitulo.appendChild(tituloColuna);
    
//                 let dadoColuna = document.createElement('td');
//                 dadoColuna.textContent = partidaAtiva[key];
//                 tabelaDado.appendChild(dadoColuna);
//             }
//         }
//     }else{
//         let msg = document.getElementById('msg');
//         msg.innerHTML = id_cripitografado.msg;
//         // console.log(id_cripitografado)

//     }

    
// }


let versaoAPI;
//returna a ultima versao da api do lol
function verificaUltimaVersao(){
    return fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(response => response.json())
        .then(data => {
            versaoAPI = data[0];
            // console.log("versaoAPI ",data);
        });
}

let box_img = document.getElementById('box-img');

function buscarCampeoes(versaoAPI){
    fetch('https://ddragon.leagueoflegends.com/cdn/'+versaoAPI+'/data/pt_BR/champion.json')
    .then(response => response.json()) // Transforma a resposta em JSON
    .then(data => {
        const champions = data;

        for(const key in champions.data){
            let dadoImg = document.createElement('img');
            dadoImg.setAttribute("data-bs-toggle","modal");
            dadoImg.setAttribute('data-bs-target',"#modalChampion");
            dadoImg.setAttribute('id', key);
            dadoImg.setAttribute('onclick', 'abrirModalChampion("'+key+'")');

            dadoImg.src = "https://ddragon.leagueoflegends.com/cdn/"+versaoAPI+"/img/champion/"+key+".png";
            box_img.appendChild(dadoImg);
        }
        // console.log(champions);
        
    }).catch(error => {
    console.error('Ocorreu um erro ao obter o JSON de campeoes:', error);
    });
}


function abrirModalChampion(champion){
    // alert(champion);
    let tituloModalChampion = document.getElementById('tituloModalChampion');
    let imgModalChampion = document.getElementById('imgModalChampion');
    let loreModalChampion = document.getElementById('loreModalChampion');
    let subTitleModalChampion = document.getElementById('subTitleModalChampion');


    $('#divSkills').empty();
    swiper.removeAllSlides();

    // Iniciar o slider no primeiro slide
    swiper.slideTo(0);
    // divSkinsModalChampion.innerHTML = '';
    let loreTab = document.getElementById('pills-lore-tab');
    loreTab.click();

    fetch('https://ddragon.leagueoflegends.com/cdn/'+versaoAPI+'/data/pt_BR/champion/'+champion+'.json')
        .then(response => response.json())
        .then(data => {
            championDetails = data.data[champion];
            tituloModalChampion.innerHTML = championDetails.name;
            imgModalChampion.src = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champion+"_0.jpg";
            loreModalChampion.innerHTML = championDetails.lore;
            subTitleModalChampion.innerHTML = championDetails.name + " " + championDetails.title;


            // INICIO ISKINS
            championDetails.skins.forEach((skin, index) => {
                const numSkin = skin.num;
                // console.log(skin);
                // Criar elemento div swiper-slide
                const divSwiperSlide = $('<div class="swiper-slide"></div>');
    
                // Criar elemento div testimonialBox
                const divTestimonialBox = $('<div class="testimonialBox"></div>');
    
                // Criar o elemento img
                const img = $('<img>', {
                    src: "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/"+ champion+ "_" + numSkin + ".jpg",
                    alt: "skin_" + (index + 1)
                });

                const divContentSlide = $(`<div class="content"><div>${(skin.name === 'default') ? "" : skin.name}</div></div>`)
    
                // Adicionar a imagem à testimonialBox
                divTestimonialBox.append(img);

                divTestimonialBox.append(divContentSlide);
    
                // Adicionar a testimonialBox ao swiper-slide
                divSwiperSlide.append(divTestimonialBox);
    
                // Adicionar swiper-slide ao swiper-wrapper
                $('#swiper-wrapper').append(divSwiperSlide);
            });
             // Adicione um ouvinte de evento para o evento slideChange
            swiper.on('slideChange', function () {
                // Recupera o índice do slide ativo
                const activeSlideIndex = swiper.activeIndex;
                const numSkin = championDetails.skins[activeSlideIndex].num;

                const imgURL = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champion + "_" + numSkin + ".jpg";

                // Atualiza a imagem na outra div
                imgModalChampion.src = imgURL;
            });

            // FIM ISKINS

                const divSpell = $('<div class="divSpell"></div');
                $('#divSkills').append(divSpell);

                const imgPassive = $('<img>', {
                    src: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/passive/"+championDetails.passive.image.full,
                    alt: "passive"
                });

                divSpell.append(imgPassive);
                divSpell.on("click", function(){
                    const nameSpell = championDetails.passive.name;
                    const textSpell = championDetails.passive.description;

                    $("#nameSpell").text(nameSpell);
                    $("#textSpell").text(textSpell);

                });
                


            championDetails.spells.forEach((spell, index) => {
                const divSpell = $('<div class="divSpell"></div');
                $('#divSkills').append(divSpell);

                const teclas = ['Q', 'W', 'E', 'R'];
                const teclaSpell = teclas[index];

                const spanSpell = $('<span>'+teclaSpell+'</span>');
                divSpell.append(spanSpell);

                const imgSpell = $('<img>', {
                    src: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/"+spell.image.full,
                    alt: "Spell_"+teclaSpell
                });
                
                divSpell.append(imgSpell);


                divSpell.on("click", function(){
                    const nameSpell = spell.name;
                    const textSpell = spell.description;

                    $("#nameSpell").text(nameSpell);
                    $("#textSpell").text(textSpell);
                    // console.log('spell',textSpell);
                });
            });


            console.log(championDetails);          


    }).catch(error => {
            console.error('Ocorreu um erro ao obter o JSON de campeoes:', error);
    });

}


verificaUltimaVersao().then(() => {
    buscarCampeoes(versaoAPI);
  })