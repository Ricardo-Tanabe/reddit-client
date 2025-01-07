import { marked } from 'marked';

const container = document.querySelector('.container');
const addNewLanguage = document.querySelector('.circle');
const clearLocalStorage = document.querySelector('.reset');
const popup = document.querySelector('.popup');
const loadScreen = document.querySelector('.popup-load');
const htmlText = `<div class="subreddit adjust"><span></span><span><img src="./more.png" alt="icone de três pontos"></span><div class="option"><span>Refresh</span><span>Delete</span></div></div>`;
let languagesList = {}
const state = {
    load: {text: `Loading ${undefined} subreddit...`, bg: 'rgb(200, 200, 200)'},
    sucess: {text: `${undefined} subreddit found`, bg: 'rgb(180, 255, 180)'},
    error: {text: `Resource ${undefined} not found`, bg: 'rgb(255, 180, 180)'},
    langExist: {text: `Resource ${undefined} exist`, bg: 'rgb(200, 200, 200)'},
    delete: {text: `${undefined} subreddit loaded`, bg: 'rgb(180, 255, 180)'}
};
let subredditSelect = [];

async function getSubreddit(subreddit) {
    const url = `https://www.reddit.com/r/${subreddit}.json`;
    await statusWarning(subreddit, state.load);
    try {
        const response = await fetch(url);
        if(!response.ok){
            await statusWarning(subreddit, state.error);
            return;
        }
        const subPack = await response.json();
        const dataList = subPack.data.children;
        if(!(subreddit in languagesList)) {
            languagesList[`${subreddit}`] = {delete: false}
            saveChange()
        }
        createSubredditColumn(subreddit, dataList)
        await statusWarning(subreddit, state.sucess);
    } catch (error) {
        await statusWarning(subreddit, state.error);
    }
}

function statusWarning(subreddit, state) {
    const name = subreddit.charAt(0).toUpperCase() + subreddit.slice(1);
    const updatedMessage = state.text.replace('undefined', name);
    loadScreen.children[0].innerHTML = updatedMessage;
    loadScreen.style.backgroundColor = state.bg;
    loadScreen.style.display = 'flex';
    return new Promise((resolve) => {
        setTimeout(() => {
            loadScreen.style.display = 'none';
            resolve();
        }, 2000);
    });
}

function decodeHTMLEntities(text) {
    const tempElemnt = document.createElement('textarea');
    tempElemnt.innerHTML = text;
    return marked(tempElemnt.value);
}

function createInnerContent(selftext, titleTxt, authorTxt, num_comments) {
    const title = document.createElement('h3');
    const post = document.createElement('p');
    const info = document.createElement('p');
    const author = document.createElement('span');
    const vote = document.createElement('span');

    title.className = 'title';
    post.className = 'post';
    info.className = 'info';
    author.className = 'author';
    vote.className = 'vote';

    title.innerHTML = titleTxt;
    post.innerHTML = decodeHTMLEntities(`${selftext}`);
    author.innerHTML = 'author: ' + authorTxt + ',';
    vote.innerHTML = 'number of comments: ' + num_comments;

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

function createSubredditLanes(subreddit, dataList) {
    for(let i = 0; i < dataList.length; i++) {
        const {selftext, title, author, num_comments} = dataList[i].data;
        createSubreddit(subreddit, selftext, title, author, num_comments);
    }
}

function createNewContent(language) {
    const newContainerLanguage = document.createElement('div');
    newContainerLanguage.id = language;
    newContainerLanguage.insertAdjacentHTML('afterbegin', htmlText);
    newContainerLanguage.firstChild.firstChild.innerHTML = `/r/${language}`;
    newContainerLanguage.style.width = '1000px';
    container.appendChild(newContainerLanguage);
}

function createSubredditColumn(subreddit, dataList) {
    const subredditExists = container.querySelector(`#${subreddit}`);
    if (!subredditExists) {
        createNewContent(subreddit);
    }
    createSubredditLanes(subreddit, dataList);
}

function searchSubreddit() {
    const input = popup.children[1].children[0];
    popup.style.display = 'none';
    const subredditExists = container.querySelector(`#${input.value}`)
    const lowerCaseLanguage = input.value.toLowerCase();
    if (!subredditExists) getSubreddit(lowerCaseLanguage);
    else statusWarning(input.value, state.langExist);
    input.value = '';
}

function insertSubredditName() {
    const input = popup.children[1].children[0];
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
    input.value = '';
    input.focus();
}

function saveChange() {
    let languageListString = JSON.stringify(languagesList);
    localStorage.setItem('languageListkey', languageListString);
}

async function loadChange() {
    if(localStorage.getItem('languageListkey') !== null) {
        let languageListString = localStorage.getItem('languageListkey')
        languagesList = JSON.parse(languageListString)
        for (const key in languagesList) {
            if(languagesList[key].delete) {
                await statusWarning(key, state.load);
                createNewContent(key)
                await statusWarning(key, state.delete);
            } else {
                await getSubreddit(key);
            }
        }
    }
}

document.addEventListener('click', (e) => {
    subredditSelect = document.querySelectorAll('.option span');

    if(e.target === addNewLanguage && loadScreen.style.display === 'none') {
        insertSubredditName()
    }

    if(e.target === popup.children[2] && loadScreen.style.display === 'none') {
        searchSubreddit();
    }

    if(subredditSelect.length > 0) {
        let encontrado = false;
        subredditSelect.forEach(option => {
            const parent = option.parentElement;
            if(encontrado) return;

            if(e.target.parentElement.nextElementSibling === option.parentElement) {
                option.parentElement.style.display = parent.style.display === 'flex' ? 'none' : 'flex';
                encontrado = true;
            }

            if(e.target === option) {
                const parentDiv = e.target.closest('div[id]');
                if(parentDiv) {
                    option.parentElement.style.display = parent.style.display === 'flex' ? 'none' : 'flex';
                    const languageSelected = parentDiv.id;
                    while(parentDiv.children.length > 1) {
                        languagesList[`${languageSelected}`].delete = true;
                        parentDiv.removeChild(parentDiv.lastChild);
                    }
                    if(option.innerHTML === 'Refresh') {
                        languagesList[`${languageSelected}`].delete = false;
                        getSubreddit(languageSelected)
                    }
                    saveChange()
                }
            }
        })
    }

    if(e.target === clearLocalStorage) {
        localStorage.clear(); // Usado para limpar o cache
        location.reload(); // Atualiza a página
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
    saveChange();
})

document.addEventListener('DOMContentLoaded', () => {
    loadScreen.style.display = 'none';
    popup.style.display = 'none';
    loadChange();
})
