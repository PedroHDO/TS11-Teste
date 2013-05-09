
function Contato(){
	//Atributos da Classe
	var cod = "";
	var nome = "";
	var telefone = "";
	var email = "";
	
	
	//Metodos Get-Set
	this.setNome = function(nome){
		this.nome = nome;
		}
	this.setCod = function(cod){
		this.cod = cod;
		}		
	
	this.setTelefone = function(telefone){
		this.telefone = telefone;
		}
	this.setEmail = function(email){
		this.email = email;
		}
	this.getNome = function(){
		return this.nome;
		}
	this.getCod = function(){
		return this.cod;
		}
	this.getTelefone = function(){
		return this.telefone;
		}
	this.getEmail = function(){
		return this.email;
		}
	
	//set para preenchimento do objeto pessoa por um ObjJson
	this.setObjJson = function(pessoa){
		this.email = pessoa.email;
		this.nome = pessoa.nome;
		this.telefone = pessoa.telefone;
		}
	}
function listar(){
	var daoContato = new DAOContato();
	$('#lista').html("");
	daoContato.selecionaTodos();

	}

function ControleContato(){	
		this.daoContato = new DAOContato();
	/* Função para Criar um Registro de Pessoa*/
		this.armazenarPessoas = function (pessoa){
			//Condição para indice inicial e incremento de indice 
			//ID é uma variavel Global Instanciada no inicio deste codigo
			
			
			this.daoContato.inserir(pessoa);
			/*
			localStorage.setItem(id, pessoa); //armazena pessoa em id
            alert('Contato adicionado com sucesso.');
			return id; //retorno para caso seja necessário saber se deu certo e qual o ID
			*/
			}
		
		/* Função de Update de um registro X */
		this.alterarPessoa = function (pessoa){
			this.daoContato.alterar(pessoa);
			}
			
		/* Função para Cadastrar Pessoa */
		this.cadastrar = function() {
			//declara objeto do tipo Pessoa (nome, telefone, email);
			var pessoa = new Contato();			
			//utiliza funções da Classe para inserir dados
			pessoa.setNome($('#nome').val());
			pessoa.setTelefone($('#telefone').val());
			pessoa.setEmail($('#email').val());
			
			//condicional Alterar ou Criar
			if ($('#cod').val()!=""){
				pessoa.setCod(parseInt($('#cod').val()));
				this.alterarPessoa(pessoa); //Altera
			}else{
				this.armazenarPessoas(pessoa); //Cria
				}
			this.limpar();
			}

		/* Função para Excluir um Cadastro pelo Codigo*/
		this.excluir = function (){
			cod = parseInt($('#cod').val());
			this.daoContato.excluir(cod);			
			this.limpar();
			}


		this.selecionarPorCodigo = function(cod){
			this.daoContato.selecao(cod);
			
			}
		/* Função para Limpar o Formulário de Cadastro*/
		this.limpar = function(){
			$('#cod').val("");
			$('#email').val("");
			$('#nome').val("");
			$('#telefone').val("");
			$('#excluir').hide();
			}
			
		/* Função para Preencher o Formulário de Cadastro*/
		this.carrega = function (pessoa){			
			pessoa = JSON.parse(pessoa);
			$('#cod').val(pessoa.cod);
			$('#email').val(pessoa.email);
			$('#nome').val(pessoa.nome);
			$('#telefone').val(pessoa.telefone);
			$('#excluir').show();
			}
		/* Função para Preencher a Lista de Contatos*/
		this.carregaLista = function (pessoa){			
			html = "";
			html += '<li data-theme="d" style="border-bottom:1px solid #cdcdcd; ">'+
					'<ul data-type="horizontal"><li>'+
					'<h2><a style="text-decoration:none; color:#696969;" href="#novo" onclick="ctrlContato.selecionarPorCodigo('+pessoa.cod+')">'+pessoa.nome+'</a></h2> '
					+'</li><li> Telefone: '+pessoa.telefone
					+'</li><li> e-mail: '+pessoa.email+'</li></ul></li>';
			$('#lista').append(html);
			}
		
}