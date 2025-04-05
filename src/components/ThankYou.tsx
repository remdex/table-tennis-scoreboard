export default function ThankYou() {
  return (
    <div id="thankyou">
      <p class="text-base">
        <em class="italic">Hey there! Thanks for using my little site. </em>
        If you're having trouble with it or need some additional functionality,{" "}
        <a
          href="//github.com/rickh94/table-tennis-scoreboard/issues/new"
          class="font-bold underline hover:underline-ofset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          open an issue on github
        </a>{" "}
        or{" "}
        <a
          href="//rickhenry.dev/contact"
          class="underline hover:underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          send me a message
        </a>{" "}
        on my main website.{" "}
      </p>
    </div>
  );
}
