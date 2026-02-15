import { marked } from 'marked';
import TurndownService from 'turndown';

export class slideWindowManager {
    private isWindow: boolean = false;
    private windowWrapper: HTMLElement;
    private exHandle: HTMLElement;
    private slidesWrapper: HTMLElement;
    private topDiv: HTMLElement;
    private handle: HTMLElement;

    constructor() {
        this.windowWrapper = document.createElement('div');
        document.body.appendChild(this.windowWrapper)
        this.exHandle = document.createElement('div');
        this.slidesWrapper = document.createElement('div');
        this.topDiv = document.createElement('div');
        this.handle = document.createElement('div');

        this.exHandle.addEventListener("click", () => {
            if (this.isWindow === false) {
                this.changeDisplay("default");
                this.isWindow = true;
            } else {
                this.changeDisplay("window");
                this.isWindow = false;
            }
        });
        this.addSlidesWindow();
    }

    public addSlidesWindow() {
        if (this.isWindow) return;
        const slides = document.createElement("textarea");
        slides.id = "text"
        this.slidesWrapper.style.flex = "1";
        this.slidesWrapper.style.display = "flex";
        this.slidesWrapper.style.flexDirection = "column";
        this.text2Markdown(slides, "add")

        const addBtn = document.createElement("btn");
        addBtn.textContent = "+";
        addBtn.id = "btn"
        addBtn.style.backgroundColor = "white";
        addBtn.addEventListener("click", () => {this.addTextArea()})
        
        if (slides) {
            slides.style.width = "100%";
            slides.style.height = "50px";
            slides.style.boxSizing = "border-box";
            this.slidesWrapper.className = "slides-wrapper";
            this.windowWrapper.className = "window-wrapper";
            this.topDiv.className = "top-div";
            this.handle.className = "handle";
            this.exHandle.className = "exhandle";
                this.exHandle.textContent = "窓";
                this.handle.innerText = "noteBook Window";

                this.topDiv.appendChild(this.handle);
                this.topDiv.appendChild(this.exHandle);
                this.windowWrapper.appendChild(this.topDiv);
                this.slidesWrapper.appendChild(slides);
                this.windowWrapper.appendChild(this.slidesWrapper);
                this.slidesWrapper.appendChild(addBtn);
                
                const a = document.querySelector(".pad-block") as HTMLElement;
                if (a) a.prepend(this.windowWrapper);

                this.makeDraggable(this.windowWrapper, this.handle, "move");
                this.makeDraggable(this.windowWrapper, this.slidesWrapper, "resize");
        }
    }

    private text2Markdown(element: HTMLTextAreaElement, mode: "add" | "edit"){
        element.addEventListener("keydown", async (e) => {
            if (e.shiftKey && e.key === "Enter"){
                e.preventDefault();
                const changedElement = await this.changeTextArea(element) as  unknown as HTMLElement;
                if (mode === "add"){
                    this.addTextArea();
                }
                this.markdown2Text(changedElement);
            } else if (e.key === "Backspace" && element.value === ""){
                
                const prev = element.previousElementSibling as HTMLElement;
                if (prev) {
                    const prevTextarea = await this.editMarkdown(prev) as unknown as HTMLTextAreaElement;
                    prevTextarea.focus(); 
                }
                element.remove();
            }
        }
    
    )  
    }

    private markdown2Text(element: HTMLElement){
        element.addEventListener("click", async () => {
            await this.editMarkdown(element)
        })  
    }

    private async editMarkdown(element: HTMLElement){
        const textarea = document.createElement("textarea");
        const turndownService = new TurndownService();
        const html = element.innerHTML;
        const markdown = await turndownService.turndown(html);
        textarea.value = markdown;
        element.before(textarea);
        this.text2Markdown(textarea, "edit");
        element.remove();
        return textarea;
    }

    private addTextArea(){
        const btn = this.slidesWrapper.querySelector("#btn");
        if (!btn) return;
        const textarea = document.createElement("textarea");
        textarea.id = "text";
        this.text2Markdown(textarea, "add");
        btn.before(textarea);
        textarea.focus();
    }

    private convertMarkdownToHtml = async (markdownString: string): Promise<string> => {
        const html = await marked.parse(markdownString);
        return html;
    };

    public async changeTextArea(targetElement: HTMLTextAreaElement){
        const text = targetElement.value;
        const changedText = await this.convertMarkdownToHtml(text);
        const changedElement = document.createElement("div");
        changedElement.innerHTML = changedText;
        changedElement.style.backgroundColor = "white";
        changedElement.className = "notebookContent";
        targetElement.before(changedElement);
        targetElement.remove();
        return changedElement;
    }

    private makeDraggable(element: HTMLElement, handle: HTMLElement, type: "move" | "resize") {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        const dragMouseDown = (e: MouseEvent) => {
            // e.preventDefault();
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(ifrm => ifrm.style.pointerEvents = 'none');

            if (type === "move") {
                mouseX = e.clientX;
                mouseY = e.clientY;
                document.onmousemove = elementDrag;
            } else {
                const isRightEdge = e.clientX > (element.offsetLeft + element.offsetWidth - 25);
                const isLeftEdge = e.clientX <= (element.offsetLeft + 25);
                if (isLeftEdge) {
                    document.onmousemove = (e) => elementDrag2(e, "right");
                } else if (isRightEdge) {
                    document.onmousemove = (e) => elementDrag2(e, "left");
                }
            }
            document.onmouseup = () => this.closeDragElement();
        };

        const elementDrag = (e: MouseEvent) => {
            // e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + "px";
            element.style.left = (element.offsetLeft - posX) + "px";

            if (element.offsetTop < 0) {
                element.style.top = "0px";
            }
            if (this.windowWrapper.offsetTop + this.topDiv.offsetHeight > window.innerHeight) {
                element.style.top = (window.innerHeight - this.topDiv.offsetHeight) + "px";
            }
        };

        const elementDrag2 = (e: MouseEvent, resizeType: "left" | "right") => {
            // e.preventDefault();
            const rect = element.getBoundingClientRect();
            const currentWidth = rect.width;
            const currentHeight = rect.height;
            const scrollX = window.scrollX;
            let newWidth = 0, newHeight = 0;

            if (resizeType === "left") {
                const currentLeft = rect.left + window.scrollX;
                newWidth = e.clientX - currentLeft;
            } else {
                const currentRight = rect.right + scrollX;
                newWidth = currentRight - (e.clientX + scrollX);
            }
            newHeight = currentHeight * (newWidth / currentWidth);

            if (newWidth > 100) {
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                if (resizeType === "right") {
                    element.style.left = `${e.clientX}px`;
                }
            }
        };

        handle.onmousedown = dragMouseDown;
    }

    private changeDisplay(mode: "default" | "window") {
        const wrapper = this.windowWrapper;
        if (mode === "default") {
            wrapper.style.position = "fixed";
            wrapper.style.zIndex = "999998";
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";
            wrapper.style.width = "600px";
            wrapper.style.height = "400px";
            this.exHandle.textContent = "全";
        } else {
            wrapper.style.position = "";
            wrapper.style.zIndex = "";
            wrapper.style.display = "";
            wrapper.style.flexDirection = "";
            // wrapper.style.width = "auto";
            // wrapper.style.height = "auto";
            wrapper.style.width = "600px";
            wrapper.style.height = "400px";
            this.exHandle.textContent = "窓";
        }
    }

    private closeDragElement() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(ifrm => ifrm.style.pointerEvents = 'auto');
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
