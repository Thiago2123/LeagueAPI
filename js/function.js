
$(document).ready(function() {
    let sidebar = document.querySelector(".sidebar");
    let bars = document.querySelector(".bars");
    
    bars.addEventListener("click", function() {
        sidebar.classList.contains("active") ? sidebar.classList.remove("active") :
        sidebar.classList.add("active");
    });

    $('#iconDarkMode').on("click", function() {  
        var icon = $(this);
        if (icon.hasClass('fa-sun')) {
            icon.removeClass('fa-sun').addClass('fa-moon');
            icon.css('color', '#bd009d');
            
        } else {
            icon.removeClass('fa-moon').addClass('fa-sun');
            icon.css('color', '#ffb100');

        }

        // Verifica se o corpo do documento possui a classe 'dark-mode'
        if ($('body').hasClass('dark-mode')) {
            // Se o corpo do documento já tiver a classe 'dark-mode', remove-a e restaura as variáveis CSS padrão
            $('body').removeClass('dark-mode');
            document.documentElement.style.setProperty('--fourth-color', '#FFF');
            document.documentElement.style.setProperty('--bg-color', '#ecedf0');
            

        } else {
            // Caso contrário, adiciona a classe 'dark-mode' e ajusta as variáveis CSS para o modo escuro
            $('body').addClass('dark-mode');
            document.documentElement.style.setProperty('--fourth-color', '#333');
            document.documentElement.style.setProperty('--bg-color', '#2b2b2bfc');
            document.documentElement.style.setProperty('color', '#fff');
        }
    });

    
    const diretosreservados = document.querySelector("#diretosreservados");
    var dataAtual = new Date();
    var ano = dataAtual.getFullYear();

    diretosreservados.firstChild.nodeValue = '© '+ano+" ";
});    




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


        var response = JSON.parse(request.response)
        // console.log('request',response.status);
        // console.log('request',response.status.status_code);

        if(request.status == 200){
            return response;
            
        }else{
            return response.status;
        }     
        
    } catch (error) {
        console.error("Erro na requisição: " + error);
        return error;
    }
   
    
}
