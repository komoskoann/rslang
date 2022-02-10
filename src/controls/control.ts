class Control<NodeType extends HTMLElement = HTMLElement> {
  public node: NodeType;

  public isReloadRequired: boolean = false;

  constructor(parentNode: HTMLElement, tagName = 'div', className = '', content = '', isBefore = false) {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = content;
    if (parentNode) {
      if (isBefore) {
        parentNode.prepend(el);
      } else parentNode.append(el);
    }
    this.node = el as NodeType;
  }

  destroy(): void {
    this.node.remove();
  }
}

export default Control;
