const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

//Função que vai remover a transação
const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

//Função que vai adicionar as trasações no DOM
const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+' // Quando o valor têm o sinal de (-) minus é uma DISPESA, (+) plus RECEITA, isso é valido quando vamos adicionar uma trasação
    const CSSClass = amount < 0 ? 'minus' : 'plus'  
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass) //Adicionar a class no elemento
    li.innerHTML = ` ${name} <span>${operator} R$ ${amountWithoutOperator}</span><button class="delete-btn" onClick="removeTransaction(${id})">x</button>`
    
    //carrega as transações na tela
    transactionUl.append(li)
}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts //Essa função, calcula os valores da despesas
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2) 

const getIncome = transactionAmounts => transactionAmounts //Essa função, calcula os valores da receitas
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionAmounts => transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
   const transactionAmounts = transactions.map(({ amount }) => amount) 
   const total = getTotal(transactionAmounts)
   const income = getIncome(transactionAmounts) //calcula os valores da despesas
   const expense = getExpenses(transactionAmounts) //calcula os valores da despesas
   
   balanceDisplay.textContent = `R$ ${total}` //exibi no painel saldo atual
   incomeDisplay.textContent = `R$ ${income}` //exibi no painel as despesas
   expenseDisplay.textContent = `R$ ${expense}` //exibi no painel as receitas
}

//Atualizar todas as trasações na tela 
const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()

}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const addTransactionsArray = (transactionName, transactionAmount) => { // Está criando a transação, Adicionando a transação dentro do Array transações
    transactions.push({
        id: generateID(),
        name: transactionName, 
        amount: Number(transactionAmount)
    }) 
}

const generateID = () => Math.round(Math.random() * 1000) //Gerando ID aleatórios

const cleanInputs = () => {//Função que vai Limpar o input
    inputTransactionName.value = '' 
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault() //impendido que form seja enviado e que a pagina seja recarregado

    const transactionName = inputTransactionName.value.trim() //armazenando valores do name
    const transactionAmount = inputTransactionAmount.value.trim() // armazenando valores do saldo
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '' //verifica se nenhum dos input foram preenchidos e exibindo uma msg na tela
    
    if(isSomeInputEmpty){ //verifica se nenhum dos input foram preenchidos e exibindo uma msg na tela
        alert('Por favor, preencha tanto o nome quanto o valor da transação.')
        return
    }

    addTransactionsArray(transactionName, transactionAmount) // Atualizar as transação adicionada no array e as transação criadas. 
    init() // Atualizar as transaçoes na tela 
    updateLocalStorage() // Atualizar a o localStorage
    cleanInputs() //Limpar inputs
}

form.addEventListener('submit', handleFormSubmit)