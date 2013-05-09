//1. Inicialização
function Conexao(){
	onInit();
	function onInit(){
		try {
			if (!window.openDatabase) {
				updateStatus("Erro: Seu navegador não permite banco de dados.");
			}
			else {
				initDB();
				createTables(); 
				//queryAndUpdateOverview();
				return true;
			}
		} 
		catch (e) {
			if (e == 2) {
				updateStatus("Erro: Versão de banco de dados inválida.");
			}
			else {
				updateStatus("Erro: Erro desconhecido: " + e + ".");
			}
			return;
		}
	}
	
	function initDB(){
		var shortName = 'BDContato';
		var version = '1.0';
		var displayName = 'DBContatosHD';
		var maxSize = 65536; // Em bytes
		localDB = window.openDatabase(shortName, version, displayName, maxSize);
	}
	
	function createTables(){
		/*var query = 
					' CREATE TABLE IF NOT EXISTS Telefone ( ' +
						' cod_tel INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
						' cod_contato INTEGER NOT NULL, ' +
						' fone VARCHAR NOT NULL ' +
					')';	
	
	
	
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);
				updateStatus("Tabela 'telefone' status: OK.");
			});
		} 
		catch (e) {
			updateStatus("Erro: Data base 'telefone' não criada " + e + ".");
			return;
		}*/
		
		var query = 'CREATE TABLE IF NOT EXISTS Contato( '+
						' cod INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
						' nome VARCHAR NOT NULL, '+
						' email VARCHAR NOT NULL, '+
						' telefone VARCHAR NOT NULL '+
						
					'); ';
	
	
	
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);
				updateStatus("Tabela 'contato' status: OK.");
			});
		} 
		catch (e) {
			updateStatus("Erro: Data base 'Contato' não criada " + e + ".");
			return;
		}
		return true;
	}
}






//Manipulação Do banco apos criado
	function DAOContato() {
	
	
	//2. Query e visualização de Update
	
	
	this.alterar = function (pessoa){
		var cod = pessoa.cod;
		var nome = pessoa.nome;
		var email = pessoa.email;
		var telefone = pessoa.telefone;
		if (nome == "" || cod == "" || email == "" || telefone == "") {
			updateStatus("Todos os Campos são obrigatórios!");
		}
		else {
			var query = "UPDATE Contato set nome= ?, email= ?, telefone = ? where cod= ?";
			try {
				localDB.transaction(function(transaction){
					transaction.executeSql(query, [nome, email, telefone, cod], function(transaction, results){
						if (!results.rowsAffected) {
							updateStatus("Erro: Update não realizado.");
						}
						else {							
							updateStatus("Alteração realizada com Sucesso. ");							
						}
					}, errorHandler);
				});
			} 
			catch (e) {
				updateStatus("Erro: UPDATE não realizado " + e + ".");
			}
		}
	}
	
	this.excluir = function(cod){
		
		
		var query = "DELETE FROM Contato WHERE cod= ?;";
		try {
			localDB.transaction(function(transaction){
			
				transaction.executeSql(query, [cod], function(transaction, results){
					if (!results.rowsAffected) {
						updateStatus("Erro: Delete não realizado.");
					}
					else {
						updateStatus("Exclusão realizada com sucesso.");
					}
				}, errorHandler);
			});
		} 
		catch (e) {
			updateStatus("Erro: DELETE não realizado " + e + ".");
		}
		
	}
	
	this.inserir = function (pessoa){
		var nome = pessoa.nome;
		var email = pessoa.email;
		var telefone = pessoa.telefone;
		if (nome == "" || email == "" || telefone == "") {
			updateStatus("Os campos obrigatórios!");
		}
		else {
			var query = "INSERT INTO Contato (nome, email, telefone) VALUES (?, ?, ?);";
			try {
				localDB.transaction(function(transaction){
					transaction.executeSql(query, [nome, email, telefone], function(transaction, results){
						if (!results.rowsAffected) {
							updateStatus("Erro: Inserção não realizada");
						}
						else {
							updateStatus("Inserção realizada com Sucesso.");
							
							
						}
					}, errorHandler);
				});
			} 
			catch (e) {
				updateStatus("Erro: INSERT não realizado " + e + ".");
			}
		}
	}
	
	this.selecao = function (cod){
		query = "SELECT * FROM Contato where cod = ? ";
		try {
			localDB.transaction(function(transaction){
			
				transaction.executeSql(query, [cod], function(transaction, results){
				
					var row = results.rows.item(0);
					var x = {'nome': row['nome'], 'cod': row['cod'], 'email': row['email'], 'telefone': row['telefone']};
					var v = JSON.stringify(x);
					ctrlContato.carrega(v);
				}, function(transaction, error){
					updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		}
		//return não da certo
	}
	
	/* Seleciona todos os registros do Banco de Dados*/
	this.selecionaTodos = function(){
		//Realiza a leitura no banco
		var query = "SELECT * FROM Contato ORDER BY nome";
		try {
			localDB.transaction(function(transaction){			
				transaction.executeSql(query, [], function(transaction, results){
					for (var i = 0; i < results.rows.length; i++) {
					
						var row = results.rows.item(i);
						var x = {'nome': row['nome'], 'cod': row['cod'], 'email': row['email'], 'telefone': row['telefone']};
						ctrlContato.carregaLista(x);						
					}
				}, function(transaction, error){
					updateStatus("Erro: " + error.code + "\n Mensagem: " + error.message);
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		}
		}
	/*
	function queryAndUpdateOverview(){
	
		//Remove as linhas existentes para inserÃ§Ã£o das novas
		var dataRows = document.getElementById("itemData").getElementsByClassName("data");
		
		while (dataRows.length > 0) {
			row = dataRows[0];
			document.getElementById("itemData").removeChild(row);
		};
		
		//Realiza a leitura no banco e cria novas linhas na tabela.
		var query = "SELECT * FROM vilourenco;";
		try {
			localDB.transaction(function(transaction){
			
				transaction.executeSql(query, [], function(transaction, results){
					for (var i = 0; i < results.rows.length; i++) {
					
						var row = results.rows.item(i);
						var li = document.createElement("li");
						li.setAttribute("id", row['id']);
						li.setAttribute("class", "data");
						li.setAttribute("onclick", "onSelect(this)");
						
						var liText = document.createTextNode(row['nome'] + " x "+ row['idade']);
						li.appendChild(liText);
						
						document.getElementById("itemData").appendChild(li);
					}
				}, function(transaction, error){
					updateStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT nÃ£o realizado " + e + ".");
		}
	}
	
	*/	
	
}
function updateStatus(status){
		alert(status);
	}
// Tratando erros
	
	errorHandler = function(transaction, error){
		updateStatus("Erro: " + error.message);
		return true;
	}
	
	nullDataHandler = function(transaction, results){
	}