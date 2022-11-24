class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == "" || this[i] == undefined || this[i] == null){
                console.log(this[i])
                return false
            }   
            console.log(this[i])         
            
        }
        return true
    }    
}

class BD{
    constructor(){

        let id = localStorage.getItem('id')
        if(id == null){localStorage.setItem('id', 0)}

    }

    getProximoId(){

        let proximoId = parseInt(localStorage.getItem('id')) + 1
        return proximoId

    }

    gravar(despesa){

        let id = this.getProximoId()
        
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id)

    }

    carregarTodosRegistros(){
        let despesas  = Array()
        let id = localStorage.getItem('id')

        for(let i = 1; i<=id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa == null){
                continue
            }
            despesa.key = i
            despesas.push(despesa)            
        }
        return despesas
    }
    
    pesquisar(filtro){
        let despesasFiltradas = this.carregarTodosRegistros()

        if(filtro.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(despesa => despesa.ano == filtro.ano)
        }

        if(filtro.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(despesa => despesa.mes == filtro.mes)
        }        

        if(filtro.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(despesa => despesa.dia == filtro.dia)
        }        

        if(filtro.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(despesa => despesa.tipo == filtro.tipo)
        }        

        if(filtro.descricao.trim().toUpperCase() != ''){
            despesasFiltradas = despesasFiltradas.filter(despesa => despesa.descricao.trim().toUpperCase() == filtro.descricao.trim().toUpperCase())
        }        

        if(filtro.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(despesa => despesa.valor == filtro.valor)
        }        

        return despesasFiltradas
        
    }

    removeItem(key){
        localStorage.removeItem(key)
        let despesas = this.carregarTodosRegistros()
        updateTable(despesas)
    }
}

function apagarDados(){
    document.querySelector('#ano').value = ""
    document.querySelector('#mes').value = ""
    document.querySelector('#dia').value = ""
    document.querySelector('#tipo').value = ""
    document.querySelector('#descricao').value = ""
    document.querySelector('#valor').value = ""

}

const cadastrarDespesa = () =>{

        let ano = document.querySelector('#ano').value
        let mes = document.querySelector('#mes').value
        let dia = document.querySelector('#dia').value
        let tipo = document.querySelector('#tipo').value
        let descricao = document.querySelector('#descricao').value
        let valor = document.querySelector('#valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let bd = new BD()

    if(despesa.validarDados()){

        bd.gravar(despesa)
        apagarDados()
        dispararValidModal('Gravação feita com sucesso')
        
    }else{

        dispararInvalidModal('Erro, campos obrigatorios invalidos')

    }
}

const deletarDespesa = (i) => {

}

const zerarModal = () => {
    document.querySelector('#textInfo').classList.remove('text-success')
    document.querySelector('#textInfo').classList.remove('text-danger')
    document.querySelector('#buttonAction').classList.remove('btn-success')
    document.querySelector('#buttonAction').classList.remove('btn-danger')
    document.body.classList.remove('ActionModal')
}

const dispararValidModal = (title) =>{
    zerarModal()
    document.querySelector('#textInfo').classList.add('text-success')
    document.querySelector('#buttonAction').classList.add('btn-success')
    document.querySelector('#modalTitle').textContent = title
    document.querySelector('#textComplement').textContent = 'Dados da despesa Cadastrado com sucesso'
    document.querySelector('#buttonAction').textContent = 'Voltar'
    document.body.classList.add('ActionModal')
}

const dispararInvalidModal = (title) =>{
    zerarModal()
    document.querySelector('#textInfo').classList.add('text-danger')
    document.querySelector('#buttonAction').classList.add('btn-danger')
    document.querySelector('#modalTitle').textContent = title
    document.querySelector('#textComplement').textContent = 'Dados invalidos ou incoerentes. Por favor preencha corretamente'
    document.querySelector('#buttonAction').textContent = 'Voltar e Corrigir'
    document.body.classList.add('ActionModal')
}
const carregarListaDespesas = () =>{
    let bd = new BD()
    let despesas = bd.carregarTodosRegistros()
    console.log(despesas)
    updateTable(despesas)
}

const updateTable = (despesas) =>{
    let bd = new BD()
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ""
    let total = Number()

    despesas.forEach((e, i) => {      
        
        if(e.tipo == 'Credito*'){
            console.log(e.tipo)
        }else{
            e.valor *= -1
        }

        total += Number(e.valor)
        let linha = tbody.insertRow()
        linha.insertCell(0).innerHTML = ++i
        linha.insertCell(1).innerHTML = `${e.dia} / ${e.mes} / ${e.ano}`
        linha.insertCell(2).innerHTML =`${e.tipo}`
        linha.insertCell(3).innerHTML =`${e.descricao}`
        linha.insertCell(4).innerHTML =`R$ ${(Number(e.valor).toFixed(2)).toString().replace('.',',')}`
        let btn = document.createElement('button')
        btn.classList.add('btn')
        btn.classList.add('btn-danger')
        btn.innerHTML = `<i class="fas fa-times"></i>`
        btn.id = e.key
        btn.onclick = function(){
            if(confirm('Deseja mesmo deletar o item?')){
                bd.removeItem(this.id)
            }
        }
        linha.insertCell(4).append(btn)
        
        // linha.insertCell(4).innerHTML =`<button class="btn btn-danger" onclick="deletarDespesa(${i})"></button>`
        
    });

    document.querySelector('#total').textContent = (Number(total).toFixed(2)).toString().replace('.',',')
}

const pesquisarDespesas = () => {
    const bd = new BD()

    let ano = document.querySelector('#ano').value
    let mes = document.querySelector('#mes').value
    let dia = document.querySelector('#dia').value
    let tipo = document.querySelector('#tipo').value
    let descricao = document.querySelector('#descricao').value
    let valor = document.querySelector('#valor').value

    const despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesasFiltradas = bd.pesquisar(despesa)

    updateTable(despesasFiltradas)

}