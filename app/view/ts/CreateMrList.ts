export class CreateMrList {
    private static getMrList = async () => {
        try {
            const starredProjects = await fetch(`/mergeRequest`, {
                method: 'GET',
            });
            const mrList = await starredProjects.json();
            return mrList;
        } catch (err) {
            console.error(err);
        }
    }

    private static showLoginMessage() {
        const container = document.getElementById('reviews');
        container!.innerHTML = `
            <div class="alert alert-warning text-center mt-4" role="alert">
                <h4 class="alert-heading">로그인이 필요합니다</h4>
                <p>서비스를 이용하려면 로그인이 필요합니다. 로그인 후 다시 시도해 주세요.</p>
            </div>
        `;
    }

    private static createMrCard = (project:any, tabContent: HTMLElement) => {
        project.mergeRequests.forEach((mr: any) => {
            const card = document.createElement("div");
            card.className = "card mb-3 hover-effect";

            const title = document.createElement("h3");
            title.className = "card-title";
            title.textContent = mr.title;
            card.appendChild(title);

            const author = document.createElement("div");
            author.className = "author-info";
            author.innerHTML = `
                <span>Author:</span>
                <img src="${mr.author.avatar_url}" alt="Author Avatar" class="rounded-circle" style="width: 30px; height: 30px;">
                <span>${mr.author.name} (@${mr.author.username})</span>
            `;
            card.appendChild(author);

            const assignee = document.createElement("div");
            assignee.className = "assignee-info";
            assignee.innerHTML = `
                <span>Assignee:</span>
                <img src="${mr.assignee.avatar_url}" alt="Assignee Avatar" class="rounded-circle" style="width: 30px; height: 30px;">
                <span>${mr.assignee.name} (@${mr.assignee.username})</span>
            `;
            card.appendChild(assignee);

            const metaInfo = document.createElement("div");
            metaInfo.className = "meta-info";
            metaInfo.innerHTML = `
                <div>
                    <span>👍 ${mr.upvotes} likes</span>
                </div>
                <div>
                    <span>Created on: ${new Date(mr.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                    <span>Comments: ${mr.user_notes_count}</span>
                </div>
            `;
            card.appendChild(metaInfo);

            card.onclick = () => {
                window.open(mr.web_url, '_blank');
            };

            tabContent.appendChild(card);
        });
    }

    private static hasNotMrListCard = (tabContent: HTMLElement) => {
        const noMrMessage = document.createElement("div");
        noMrMessage.className = "alert alert-info text-center mt-3";
        noMrMessage.role = "alert";
        noMrMessage.innerHTML = `
            <h5 class="alert-heading">등록된 MR이 없습니다.</h5>
            <p>다른 탭을 클릭하여 이용해주세요.</p>
        `;
        tabContent.appendChild(noMrMessage);
    }

    static createCard = async () => {
        const { success, mrList: data } = await this.getMrList();
        const content = document.getElementById('reviews');

        if (!success) {
            this.showLoginMessage();
            return;
        }

        const container = document.createElement("div");
        container.className = "tab-content";

        const tabButtons = document.createElement("ul");
        tabButtons.className = "nav nav-tabs";

        data.forEach((project: any, index: number) => {
            const tabButton = document.createElement("li");
            tabButton.className = "nav-item";
            const anchor = document.createElement("a");
            anchor.className = `nav-link ${index === 0 ? 'active' : ''}`;
            anchor.textContent = project.projectName;
            anchor.setAttribute('data-bs-toggle', 'tab');
            anchor.setAttribute('href', `#tab-${index}`);

            tabButton.appendChild(anchor);
            tabButtons.appendChild(tabButton);

            const tabContent = document.createElement("div");
            tabContent.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
            tabContent.id = `tab-${index}`;

            project.mergeRequests.length === 0 ?
            this.hasNotMrListCard(tabContent) : this.createMrCard(project, tabContent);
            container.appendChild(tabContent);
        });
        content!.appendChild(tabButtons);
        content!.appendChild(container);
    }
}
