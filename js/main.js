console.log('Starting up');

var gProjs = [{
    id: "sprint-1-mines-weeper-responsive",
    name: "Mines-Weeper",
    title: "The legendery game ",
    desc: "Find out where all the mines ",
    url: "/projects/sprint-1-mines-weeper-responsive",
    publishedAt: 'October 18',
    labels: ["Matrixes", "gameBoard"],
    img: "img/portfolio/mines.jpg",
    liveDemo:"projects/sprint-1-mines-weeper-responsive/index.html"
},
{
    id: "touch-nums-project",
    name: "Touch Nums",
    title: "Touch Nums",
    desc: "Click the numbers by its order as fast as you can",
    url: "/projects/touch-nums-project",
    publishedAt: 'October 18',
    labels: ["Matrixes", "keyboard events"],
    img: 'img/portfolio/touch-num.jpg',
    liveDemo:"projects/touch-nums-project/index.html"

},
{
    id: "ball-Board-project-with nice design",
    name: "Ball-board",
    title: "Ball-board",
    desc: "Collect all those balls",
    url: "/projects/ball-Board-project-with nice design",
    publishedAt: 'October 18',
    labels: ["Matrixes", "keyboard events"],
    img: 'img/portfolio/ball-board.jpg',
    liveDemo:"projects/ball-Board-project-with nice design/ball-board/index.html"

}];

function initPage() {
    renderProjs();
}


function contact() {
    var userName=document.querySelector('#name-form');
    var message=document.querySelector('#message-form');
    window.location='https://mail.google.com/mail/?view=cm&fs=1&to=reut1990@gmail.com&su='+userName.value+"&body="+message.value+"'";
}

function renderProjs() {
    var elPortfolioContainer = document.querySelector('#portfolio-container');
    // var elModalsContainer = document.querySelector('#modals-container');

    var strHtmlPreviews = '';
    // var strHtmlModals = '';

    for (var i = 0; i < gProjs.length; i++) {
        var proj = gProjs[i];
        strHtmlPreviews += `
    <div class="col-md-4 col-sm-6 portfolio-item">
          <a onclick="projClicked(${i})" class="portfolio-link" data-toggle="modal" href="#portfolioModal">
            <div class="portfolio-hover">
              <div class="portfolio-hover-content">
                <i class="fa fa-plus fa-3x"></i>
              </div>
            </div>
            <img id="preview-img" class="img-fluid" src='${proj.img}' alt="">
          </a>
          <div class="portfolio-caption">
            <h4>${proj.name}</h4>
            <p class="text-muted">Illustration</p>
          </div>
        </div>
        `;

        //     strHtmlModals += `
        // <div class="portfolio-modal modal fade" id="portfolioModal${i}" tabindex="-1" role="dialog" aria-hidden="true">
        //     <div class="modal-dialog">
        //       <div class="modal-content">
        //         <div class="close-modal" data-dismiss="modal">
        //           <div class="lr">
        //             <div class="rl"></div>
        //           </div>
        //         </div>
        //         <div class="container">
        //           <div class="row">
        //             <div class="col-lg-8 mx-auto">
        //               <div class="modal-body">
        //                 <!-- Project Details-->
        //                 <h2>${proj.name}</h2>
        //                 <p class="item-intro text-muted">${proj.title}</p>
        //                 <img class="img-fluid d-block mx-auto" src="${proj.img}" alt="">
        //                 <p> ${proj.desc}</p>
        //                 <ul class="list-inline">
        //                   <li>Date: ${proj.publishedAt}</li>
        //                   <li>Labels: ${proj.labels}</li>
        //                 </ul>
        //                 <button class="btn btn-primary" data-dismiss="modal" type="button">
        //                     <i class="fa fa-times"></i>
        //                     Close Project</button>
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // `
    }



    elPortfolioContainer.innerHTML = strHtmlPreviews;
    // elModalsContainer.innerHTML = strHtmlModals;

}


function projClicked(idx) {
    var proj = gProjs[idx];
    // console.log(proj, 'work');
    $('#project-name').text(proj.name);
    $('#project-title').text(proj.title);
    $('#project-img').attr("src", proj.img);
    $('#project-description').text(proj.desc);
    $('#project-date').text('Date:' + proj.publishedAt);
    $('#project-labels').text('Labels:' + proj.labels);
    $('#live-demo').attr("href", proj.liveDemo);


    // console.log(idx);
    // var elContainer = document.querySelector('#selected-proj-container');

    // elContainer
    //     .querySelector('h2')
    //     .innerHTML = gProjs[idx].name;

    // elContainer
    //     .querySelector('p')
    //     .innerHTML = `desc for proj ${idx + 1}`;
}
