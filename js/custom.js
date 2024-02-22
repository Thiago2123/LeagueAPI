
// CASO TENHA HEADERS NA REQUISIÇÃO DA API 
    // const headerAPI = new Headers({
    //     "Access-Control-Allow-Origin": "*"
    
    // });

    

$(document).ready(function() {
     
    verificaUltimaVersao().then(() => {
        buscarCampeoes(versaoAPI);
        campeoesFree = buscarFreeCampeoes(); 
       
    });
    
    $('#mostrarCampeaoFree').on("click", function(){
        var icon = $(this).find('i');
        icon.toggleClass('far fa-square far fa-square-check');
    
        // console.log('campeoesFree:', campeoesFree);
    
        campeoesFree = campeoesFree.map(function(item) {
            return item.toString(); // Convertendo cada item para string
        });
    
        $('.box-img').find('img').each(function() {
            if (icon.hasClass('fa-square')) {
                $(this).css('display', ''); // Resetar o estilo se estiver no array
            } else {
                var idInterno = $(this).attr('idInterno').toString(); // Convertendo para string
                if (!campeoesFree.includes(idInterno)) {
                    $(this).css('display', 'none');
                }
            }
        });
    });

    //     var icon = $(this);
    //     if (icon.hasClass('fa-sun')) {
    //         icon.removeClass('fa-sun').addClass('fa-moon');
    //         icon.css('color', '#bd009d');
            
    //     } else {
    //         icon.removeClass('fa-moon').addClass('fa-sun');
    //         icon.css('color', '#ffb100');

    //     }

    //     // Verifica se o corpo do documento possui a classe 'dark-mode'
    //     if ($('body').hasClass('dark-mode')) {
    //         // Se o corpo do documento já tiver a classe 'dark-mode', remove-a e restaura as variáveis CSS padrão
    //         $('body').removeClass('dark-mode');
    //         document.documentElement.style.setProperty('--fourth-color', '#FFF');
    //         document.documentElement.style.setProperty('--bg-color', '#ecedf0');
            

    //     } else {
    //         // Caso contrário, adiciona a classe 'dark-mode' e ajusta as variáveis CSS para o modo escuro
    //         $('body').addClass('dark-mode');
    //         document.documentElement.style.setProperty('--fourth-color', '#333');
    //         document.documentElement.style.setProperty('--bg-color', '#2b2b2bfc');
    //         document.documentElement.style.setProperty('color', '#fff');
    //     }
    // });

    
    // const diretosreservados = document.querySelector("#diretosreservados");
    // var dataAtual = new Date();
    // var ano = dataAtual.getFullYear();

    // diretosreservados.firstChild.nodeValue = '© '+ano+" ";
});    

const requestApi = {
    baseApi:"https://br1.api.riotgames.com",
    apiKey: "RGAPI-b33bec25-bf18-4b6e-bc15-47142874c034"
};


let versaoAPI;
//returna a ultima versao da api do lol
function verificaUltimaVersao(){
    return fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(response => response.json())
        .then(data => {
            versaoAPI = data[0];
            $('#versaoLol').text(versaoAPI);
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
            dadoImg.setAttribute('idInterno', ""+champions.data[key].key+"");
            dadoImg.setAttribute('onclick', 'abrirModalChampion("'+key+'")');

            dadoImg.src = "https://ddragon.leagueoflegends.com/cdn/"+versaoAPI+"/img/champion/"+key+".png";
            box_img.appendChild(dadoImg);
        }
        console.log('champions', champions.data);
        
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

    $("#nameSpell").html("");
    $("#textSpell").html("");
    $('#divModalTag').html("");

    fetch('https://ddragon.leagueoflegends.com/cdn/'+versaoAPI+'/data/pt_BR/champion/'+champion+'.json')
        .then(response => response.json())
        .then(data => {
            // console.log('data ', data)
            championDetails = data.data[champion];
            tituloModalChampion.innerHTML = championDetails.name;
            imgModalChampion.src = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champion+"_0.jpg";
            loreModalChampion.innerHTML = championDetails.lore;
            subTitleModalChampion.innerHTML = championDetails.name + " " + championDetails.title;



            const coresTags = {
                'Tank': {
                    'cor': 'success',
                    'traducao': 'Tanque'
                },
                'Fighter': {
                    'cor': 'primary',
                    'traducao': 'Lutador'
                },
                'Marksman': {
                    'cor': 'warning',
                    'traducao': 'Atirador'
                },
                'Mage': {
                    'cor': 'purple',
                    'traducao': 'Mago'
                },
                'Assassin': {
                    'cor': 'danger',
                    'traducao': 'Assassino'
                },
                'Support': {
                    'cor': 'info',
                    'traducao': 'Suporte'
                }
            };

            championDetails.tags.forEach((tag, index) => {
                
                
                const tagInfo = coresTags[tag];
                const cor = tagInfo ? tagInfo.cor : 'primary'; // Se a tag não estiver no objeto coresTags, atribui a cor primária
                const traducao = tagInfo ? tagInfo.traducao : tag; // Se a tag não estiver no objeto coresTags, atribui uma string a tag sem tradução
                const tagHtml = $('<span class="badge rounded-pill text-bg-' + cor + '">' + traducao + '</span>');
            
                $('#divModalTag').append(tagHtml);

            });

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

            // INICIO HABILIDADES
            // Quando clica no divSpell dentro do divSkills adiciona a classe active
            $('#divSkills').on("click", ".divSpell", function(){
                const divSpell = $(this); // Captura a divSpell clicada
                // Encontra o elemento ativo e remove a classe active
                $('#divSkills').find('.divSpell.active').removeClass('active');
                // Adiciona a classe active ao elemento clicado
                divSpell.addClass('active');
            });
        

            const divSpell = $('<div id="divSpell" class="divSpell"></div');
            $('#divSkills').append(divSpell);

            const imgPassive = $('<img>', {
                src: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/passive/"+championDetails.passive.image.full,
                alt: "passive"
            });

            divSpell.append(imgPassive);

            divSpell.on("click", function(){
                const nameSpell = championDetails.passive.name;
                const textSpell = championDetails.passive.description;
                $("#nameSpell").html(nameSpell);
                $("#textSpell").html(textSpell);

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

                    $("#nameSpell").html(nameSpell);
                    $("#textSpell").html(textSpell);
                    // console.log('spell',textSpell);
                });
            });

            // FIM HABILIDADES

            console.log("championDetails",championDetails);          


        }).catch(error => {
            console.error('Ocorreu um erro ao obter o JSON de campeoes:', error);
        });

}



function buscarFreeCampeoes(){
    data = fazGet(requestApi.baseApi+'/lol/platform/v3/champion-rotations?api_key='+requestApi.apiKey+'');
    const retornoApi = JSON.parse(data);
    return retornoApi.freeChampionIds;

}