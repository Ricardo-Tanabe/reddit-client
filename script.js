import { marked } from 'marked';

const container = document.querySelector('.container');
const addNewLanguage = document.querySelector('.add-subreddit > div');
const popup = document.querySelector('.popup');
const loadScreen = document.querySelector('.popup-load');
const htmlText = `<div class="subreddit adjust"><span></span><span><img src="./more.png" alt="icone de três pontos"></span><div class="option"><span>Refresh</span><span>Delete</span></div></div>`;
let subredditSelect = null;

async function getSubreddit(subreddit) {
    const url = `https://www.reddit.com/r/${subreddit}.json`;
    loadStyle(subreddit);
    try {
        const response = await fetch(url);
        if(!response.ok){
            if (response.status === 404) {
                console.error('Recurso não encontrado (404).');
            } else if (response.status === 302) {
                console.error('Redirecionamento encontrado (302).');
            } else {
                console.error(`Erro HTTP! status: ${response.status}`);
            }
            errorStyle(subreddit);
            return;
        }
        const subPack = await response.json();
        const dataList = subPack.data.children;
        createNewContent(subreddit);
        for(let i = 0; i < dataList.length; i++) {
            const {selftext, title, author, num_comments} = dataList[i].data;
            createSubreddit(subreddit, selftext, title, author, num_comments);
        }
        sucessStyle(subreddit);
    } catch (error) {
        if (error.message.includes('CORS')) {
            console.error('Erro de CORS. Verifique as configurações do servidor.');
        } else {
            console.error('Ocorreu um erro:', error);
        }
        errorStyle(subreddit);
    }
}

function loadStyle(subreddit) {
    const name = subreddit.charAt(0).toUpperCase() + subreddit.slice(1);
    loadScreen.children[0].innerHTML = `Loading ${name} subreddit...`;
    loadScreen.style.backgroundColor = 'rgb(200, 200, 200)';
    setTimeout(() => {
        loadScreen.style.display = 'none';
    }, 2000);
}

function sucessStyle(subreddit) {
    const name = subreddit.charAt(0).toUpperCase() + subreddit.slice(1);
    loadScreen.children[0].innerHTML = `${name} subreddit found`;
    loadScreen.style.backgroundColor = 'rgb(180, 255, 180)';
    setTimeout(() => {
        loadScreen.style.display = 'none';
    }, 2000);
}

function errorStyle(subreddit) {
    const name = subreddit;
    loadScreen.children[0].innerHTML = `Resource ${name} not found`;
    loadScreen.style.backgroundColor = 'rgb(255, 180, 180)';
    setTimeout(() => {
        loadScreen.style.display = 'none';
    }, 2000);
}

function decodeHTMLEntities(text) {
    const tempElemnt = document.createElement('textarea');
    tempElemnt.innerHTML = text;
    return tempElemnt.value;
}

function createInnerContent(selftext, titleTxt, authorTxt, num_comments) {
    const title = document.createElement('h3')
    const post = document.createElement('p')
    const info = document.createElement('p')
    const author = document.createElement('span')
    const vote = document.createElement('span')
    const decodedText = decodeHTMLEntities(`${selftext}`)

    title.className = 'title';
    post.className = 'post';
    info.className = 'info';
    author.className = 'author';
    vote.className = 'vote';

    title.innerHTML = titleTxt;
    post.innerHTML = marked(decodedText);
    author.innerHTML = 'author: ' + authorTxt + ',';
    vote.innerHTML = 'number of comments: ' + num_comments

    info.appendChild(author);
    info.appendChild(vote)

    return [title, post, info];
}

function createSubreddit(language, selftext, titleTxt, authorTxt, num_comments) {
    const languageContainer = document.getElementById(language);
    const newSubreddit = document.createElement('div');
    newSubreddit.className = 'subreddit';

    const [title, post, info] = createInnerContent(selftext, titleTxt, authorTxt, num_comments);

    newSubreddit.appendChild(title);
    newSubreddit.appendChild(post);
    newSubreddit.appendChild(info);

    languageContainer.appendChild(newSubreddit);
}

function createNewContent(language) {
    const newContainerLanguage = document.createElement('div');
    newContainerLanguage.id = language;
    newContainerLanguage.insertAdjacentHTML('afterbegin', htmlText);
    newContainerLanguage.firstChild.firstChild.innerHTML = `/r/${language}`;
    newContainerLanguage.style.width = '1000px';
    container.appendChild(newContainerLanguage);
}

function searchSubreddit() {
    const input = popup.children[1].children[0];
    loadScreen.style.display = 'flex';
    popup.style.display = 'none';
    getSubreddit(input.value);
    input.value = '';
}

function existSibling() {
    const target = document.querySelector('.add-subreddit');
    if(target.nextElementSibling) {
        return true;
    }
    return false;
}

document.addEventListener('click', (e) => {
    subredditSelect = document.querySelectorAll('.option span')

    if(e.target === addNewLanguage && loadScreen.style.display === 'none') {
        const input = popup.children[1].children[0];
        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        input.value = '';
        input.focus();
    }

    if(e.target === popup.children[2] && loadScreen.style.display === 'none') {
        searchSubreddit();
        if(existSibling()) {
            const option = document.querySelector('.option');
            refreshSubreddit = option.children[0];
            deleteSubreddit = option.children[1];
        }
    }
    
    if(subredditSelect.length > 0) {
        let encontrado = false;
        subredditSelect.forEach(option => {
            if(encontrado) return;
            if(e.target.parentElement.nextElementSibling === option.parentElement) {
                const parent = option.parentElement;
                option.parentElement.style.display = parent.style.display === 'flex' ? 'none' : 'flex';
                encontrado = true;
            }

            if(option.innerHTML === 'Refresh' && e.target === option) {
                console.log(option)
                // Inserir a lógica do refresh
            } else if(option.innerHTML === 'Delete' && e.target === option) {
                console.log(option)
                // Inserir a lógica do delete
            }
        })
    }

})

document.addEventListener('keydown', (e) => {
    if(popup.style.display !== 'none') {
        if(e.key === 'Enter') {
            searchSubreddit();
        } else if (e.key === 'Escape') {
            popup.style.display = 'none';
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    loadScreen.style.display = 'none';
    popup.style.display = 'none';
})
