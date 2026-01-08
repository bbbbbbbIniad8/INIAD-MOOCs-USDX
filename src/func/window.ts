export class slideWindowManager {
    private isWindow: boolean = false;
    private windowWrapper: HTMLElement;
    private exHandle: HTMLElement;
    private slidesWrapper: HTMLElement;
    private topDiv: HTMLElement;
    private handle: HTMLElement;

    constructor() {
        this.windowWrapper = document.createElement('div');
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
        const slides = document.querySelector('.embed-responsive.require-3pc') as HTMLElement;
        
        if (slides) {
            slides.style.width = '100%';
            slides.style.height = '100%';
            this.slidesWrapper.className = "slides-wrapper";
            this.windowWrapper.className = "window-wrapper";
            this.topDiv.className = "top-div";
            this.handle.className = "handle";
            this.exHandle.className = "exhandle";

            const parent = slides.parentNode;
            if (parent) {
                this.exHandle.textContent = "窓";
                this.handle.innerText = "Google Slide Window";

                this.topDiv.appendChild(this.handle);
                this.topDiv.appendChild(this.exHandle);
                this.windowWrapper.appendChild(this.topDiv);
                this.slidesWrapper.appendChild(slides);
                this.windowWrapper.appendChild(this.slidesWrapper);
                
                const a = document.querySelector(".pad-block") as HTMLElement;
                if (a) a.prepend(this.windowWrapper);

                this.makeDraggable(this.windowWrapper, this.handle, "move");
                this.makeDraggable(this.windowWrapper, this.slidesWrapper, "resize");
            }
        }
    }

    private makeDraggable(element: HTMLElement, handle: HTMLElement, type: "move" | "resize") {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        const dragMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            const iframes = element.querySelectorAll('iframe');
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
            document.onmouseup = () => this.closeDragElement(element);
        };

        const elementDrag = (e: MouseEvent) => {
            e.preventDefault();
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
            e.preventDefault();
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
            wrapper.style.width = "auto";
            wrapper.style.height = "auto";
            this.exHandle.textContent = "窓";
        }
    }

    private closeDragElement(element: HTMLElement) {
        const iframes = element.querySelectorAll('iframe');
        iframes.forEach(ifrm => ifrm.style.pointerEvents = 'auto');
        document.onmousemove = null;
        document.onmouseup = null;
    }
}