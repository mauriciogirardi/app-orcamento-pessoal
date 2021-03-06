class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    //criando um Id no Storege
    getProximoId() {
        let proximoId = localStorage.getItem('id') //null
        return parseInt(proximoId) + 1
    }

    //gravando no Storege
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        //atualizando o novo Id
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        //Array de despesas
        let despesas = Array()
        //recuperar todas as despesas cadastradas em localStorage
        let id = localStorage.getItem('id')
        for(let i = 1; i <= id; i++) {
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            //existe a posiibilidade de haver índeces que foram pulados/removidos.nestes casos nós vamos pular esses índices
            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas

    }//metodo recuperarTodosRegistros()

    pesquisar(despesa) {
        let despesasFiltradas =Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)
    }

}//Class Bd

let bd = new Bd()


//onclick buttom
function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)


	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
} //function carregarListaDespesas()

//Carregar pagina de listas das despesas 
function carregarListaDespesas(despesas = Array(), filter = false) {
    if(despesas.length == 0 && filter == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    //selecionando o elemento tbody da tabela.
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /*  <tr>
            <td>23/12/2019</td>
            <td>Alimentação</td>
            <td>Almoço 4 pessoas</td>
            <td>110,00</td>
        </tr> 
    */
    //percorrer o array despesas, listando cada despesa de forma dinâmica.
    despesas.forEach(function(d) {
        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        // criando as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia }/${d.mes }/${d.ano}`
        //ajusta o tipo
        switch(parseInt(d.tipo)) {
            case 1 : d.tipo = 'Alimentação'
                break
            case 2 : d.tipo = 'Educação'
                break
            case 3 : d.tipo = 'Lazer'
                break
            case 4 : d.tipo = 'Saúde'
                break
            case 5 : d.tipo = 'Transporte'
                break
            case 6 : d.tipo = 'Gasolina'
                break
            case 7 : d.tipo = 'Material de construção'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$${d.valor}`

       	//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){

			let id = this.id.replace('id_despesa_','')
        
			bd.remover(id)
			window.location.reload()
        }
        
		linha.insertCell(4).append(btn)
    })
}

// pesquisa de filtro
function pesquisaDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor =  document.getElementById('valor').value

    let dispesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas =  bd.pesquisar(dispesa)

    this.carregarListaDespesas(despesas, true)
}