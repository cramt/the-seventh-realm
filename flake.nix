{
  description = "the seventh realm";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }: let
  in
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
      neorgNeovimPackage = pkgs.neovim.override {
        configure = {
          customRC = ''
            set shada="NONE"
            lua require("neorg").setup({ load = { ["core.export"] = {}, ["core.export.markdown"] = { config = { extensions = "all" } }, ["core.defaults"] = {}, ["core.esupports.metagen"] = {}, } })
          '';
          packages.myVimPackage = with pkgs.vimPlugins; {
            start = [
              neorg
              (nvim-treesitter.withPlugins (p: [p.norg pkgs.tree-sitter-grammars.tree-sitter-norg-meta]))
            ];
          };
        };
      };
    in {
      packages = {
      };

      devShells.default = pkgs.mkShell {
        shellHook = ''
          export NEORG_NVIM=${neorgNeovimPackage}
        '';
      };
    });
}
