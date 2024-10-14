//----- VARIÁVEIS -----
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var btnMenu = document.querySelector('.botao__voltar-menu')

var velocidadeX = 1
var velociddadeY = 0
var cobraX = 0
var cobraY = 0
var cabecaCobra = {cobraX, cobraY}
var totalCobra = 0
var caminhoCobra = []

var pontuacoes = []
var quantMaca = 0
var pontuacaoAtual = document.querySelector('.pontuacao')
var melhorPontuacao = document.querySelector('.melhor-pontuacao')
var maior = 0
var maiorJSON = localStorage.getItem('Melhor pontuação')

if (maiorJSON === null) {
    maiorJSON = 0
}

maior = JSON.parse(maiorJSON)
melhorPontuacao.innerHTML = `<p class="melhor-pontuacao">Melhor pontuação: ${maior}</p>`

var cobra = new Cobra(18,18, "#059212", cobraX, cobraY)
var maca = new Maca(18,18,"#AC0C0C")

setInterval(andarCobra,10)
document.addEventListener('keydown', evento => escolherDirecao(evento))
btnMenu.addEventListener('click', () => {
    window.location.href = 'index.html'
})

// ----- FUNÇÕES -----
function gerarCoordenadaAleatoria() { //Cria uma coordenada aleatória para a maçã
    return Math.floor(Math.random() * 485 + 1)
}

function Cobra(largura, altura, cor, x, y) {
    this.largura = largura
    this.altura = altura
    this.cor = cor
    this.x = x
    this.y = y

    this.desenha = () => {
        ctx.fillStyle = cor
        ctx.fillRect(x,y, largura, altura) //coordenadas (x,y), sendo x e y pixels
    }

    this.aumentar = (dx,dy) => {
        ctx.fillStyle = cor
        ctx.fillRect(dx,dy, 18, 18)
    }
}

function Maca(largura, altura, cor){
    this.largura = largura
    this.altura = altura
    this.cor = cor
    this.macaX =  gerarCoordenadaAleatoria()
    this.macaY = gerarCoordenadaAleatoria()

    this.desenha = () => {
        ctx.fillStyle = cor
        ctx.fillRect(this.macaX,this.macaY, largura, altura)
    }

    this.desaparece = (x,y) => {
        ctx.clearRect(x,y,canvas.width,canvas.height)
        ctx.fillStyle = 'white'
        ctx.fillRect(x,y, largura, altura)
    }

    this.novaCoordenada = () => {
        this.macaX =  gerarCoordenadaAleatoria()
        this.macaY = gerarCoordenadaAleatoria()
    }
}
function andarCobra() {
    cobraX += velocidadeX
    cobraY += velociddadeY

    cabecaCobra.cobraX = cobraX
    cabecaCobra.cobraY = cobraY

    caminhoCobra.unshift({x: cobraX, y: cobraY})

    if (cobraX > 485 || cobraX < 0) { //Caso a cobra saia da delimitação do jogo, a página é recarregada
        window.location.reload()
    }
    if (cobraY > 485 || cobraY < 0) {
        window.location.reload()
    }

    cobra.desenha()
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.fillRect(cobraX, cobraY,18,18)
    ctx.beginPath()
    maca.desenha()
    comerMaca()
    aumentarTamanhoCobra(totalCobra)

    let maiorPontuacao = pontuacaoMelhor(pontuacoes,maior)
    //localStorage.removeItem('Melhor pontuação')
    localStorage.setItem('Melhor pontuação', JSON.stringify(maiorPontuacao))
}

function direcao(dx,dy) {
    if (velocidadeX === dx) { //Verificações que evitam a cobra "voltar" na mesma direção
        return
    }
   if (velociddadeY === dy) {
        return
    }
    velocidadeX = dx
    velociddadeY = dy
}

function escolherDirecao(evento) {
    let tecla = evento.key
    if (tecla === 'ArrowLeft') {
        direcao(-1,0)
    }
    if (tecla === 'ArrowRight') {
        direcao(1,0)
    }
    if (tecla === 'ArrowUp') {
        direcao(0,-1)
    }
    if (tecla === 'ArrowDown') {
        direcao(0, 1)
    }
}

function comerMaca() {
    if (verificarPosicaoMaca()) {
        maca.desaparece(maca.macaX,maca.macaY)
        maca.novaCoordenada()
        maca.desenha()
        quantMaca += 1
        pontuacaoAtual.innerHTML = `<p class="pontuacao">Pontuação atual: ${quantMaca}</p>`
        pontuacoes.push(quantMaca)

        totalCobra += 1
    }
}

function pontuacaoMelhor(pontuacoes, maior) {
    for (let i = 0; i < pontuacoes.length; i++) {
        if (pontuacoes[i] > maior) {
            maior = pontuacoes[i]
        }
    }
    return maior
}

// Para que a cobra consiga comer sem que ela e a maçã estajam exatamente na mesma posição
function verificarPosicaoMaca() {
    if ((cabecaCobra.cobraX === maca.macaX) && (cabecaCobra.cobraY === maca.macaY)) {
        return true
    } else if ((cabecaCobra.cobraX === (maca.macaX + 1)) && (cabecaCobra.cobraY === (maca.macaY + 1))) {
        return true
    } else if ((cabecaCobra.cobraX === (maca.macaX - 1)) && (cabecaCobra.cobraY === (maca.macaY - 1))) {
        return true
    }

    return false
}

function aumentarTamanhoCobra(total) {
    for (let i = 0; i < total; i++) {
        cobra.aumentar(caminhoCobra[i].x, caminhoCobra[i].y)
    }
}