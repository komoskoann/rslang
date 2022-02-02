class Control<NodeType extends HTMLElement = HTMLElement> {
  public node: NodeType;

  constructor(parentNode: HTMLElement, tagName = 'div', className = '', content = '', id = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.id = id;
    el.textContent = content;
    if (parentNode) {
      parentNode.append(el);
    }
    this.node = el as NodeType;
  }

  destroy(): void {
    this.node.remove();
  }
}

export default Control;
