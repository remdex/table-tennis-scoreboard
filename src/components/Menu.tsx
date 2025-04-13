import {
  createSignal,
  onCleanup,
  onMount,
  Show,
  type PropsWithChildren,
} from "solid-js";

export default function Menu(props: PropsWithChildren) {
  const [open, setOpen] = createSignal(false);
  let ref!: HTMLDivElement;
  let buttonRef!: HTMLButtonElement;
  let navRef!: HTMLElement;

  const handleClick = (event: MouseEvent) => {
    if (event.target && !ref.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  onMount(() => {
    if (globalThis.addEventListener) {
      globalThis.addEventListener("click", handleClick);
    }
  });

  onCleanup(() => {
    if (globalThis.removeEventListener) {
      globalThis.removeEventListener("click", handleClick);
    }
  });

  return (
    <div ref={ref} id="menu" class="fixed right-0 bottom-0 mr-4 mb-4">
      <Show when={open()}>
        <nav
          class="absolute -translate-y-full top-0 right-0 z-50"
          ref={navRef}
          onClick={() => setOpen(false)}
        >
          {props.children}
        </nav>
      </Show>
      <button
        ref={buttonRef}
        id="menu-button"
        data-testid="menu-button"
        onClick={() => {
          setOpen((prev) => !prev);
          buttonRef.blur();
        }}
        class="py-2 px-4 flex items-center font-mono font-bold text-black uppercase bg-white border border-r-4 border-b-4 border-black active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4 border-t  border-l selectable"
      >
        Menu
        <span class="material-symbols--menu size-6 ml-1 -mt-0.5 -mr-2"></span>
      </button>
    </div>
  );
}
