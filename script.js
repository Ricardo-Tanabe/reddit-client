const container = document.querySelector('.container')

async function getSubreddit(subreddit) {
    const url = `https://www.reddit.com/r/${subreddit}.json`;
    try {
        const response = await fetch(url);
        if(!response.ok){
            console.log('Erro');
            return;
        }
        const subPack = await response.json();
        const dataList = subPack.data.children
        for(let i = 0; i < dataList.length; i++) {
            const {selftext, title, author, num_comments} = dataList[i].data
            createSubreddit(selftext, title, author, num_comments)
        }
    } catch (error) {
        console.log(error);
    }
}

function createInnerContent(selftext, titleTxt, authorTxt, num_comments) {
    const title = document.createElement('h3')
    const post = document.createElement('p')
    const info = document.createElement('p')
    const author = document.createElement('span')
    const vote = document.createElement('span')

    title.className = 'title';
    post.className = 'post';
    info.className = 'info';
    author.className = 'author';
    vote.className = 'vote';

    title.innerHTML = titleTxt;
    post.innerHTML = `${selftext}`;
    author.innerHTML = 'author: ' + authorTxt + ',';
    vote.innerHTML = 'number of comments: ' + num_comments

    info.appendChild(author);
    info.appendChild(vote)

    return [title, post, info];
}

function createSubreddit(selftext, titleTxt, authorTxt, num_comments) {
    const newSubreddit = document.createElement('div');
    newSubreddit.className = 'subreddit';

    const [title, post, info] = createInnerContent(selftext, titleTxt, authorTxt, num_comments);

    newSubreddit.appendChild(title);
    newSubreddit.appendChild(post);
    newSubreddit.appendChild(info);

    container.appendChild(newSubreddit);
}

document.addEventListener('DOMContentLoaded', () => {
    getSubreddit('javascript');
})
