{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.nodejs
    pkgs.nodePackages.pnpm
    pkgs.netlify-cli
  ];

  languages = {
    javascript = {
      enable = true;
      package = pkgs.nodejs;
    };
  };

  scripts.clean.exec = "rm -rf _site _tmp";
  scripts.dev.exec = "pnpm start";
  scripts.build.exec = "rm -rf _site _tmp; pnpm build";
  scripts.draft.exec = "rm -rf _site _tmp; pnpm build; netlify deploy";
  scripts.publish.exec = "rm -rf _site _tmp; pnpm build; netlify deploy --prod";

}
