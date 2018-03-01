" Load plugins
call plug#begin('~/.vim/plugged')

Plug 'flazz/vim-colorschemes'
Plug 'mattn/emmet-vim'
Plug 'PotatoesMaster/i3-vim-syntax'
Plug 'junegunn/goyo.vim'
Plug 'itchyny/lightline.vim'
Plug 'tpope/vim-surround'
Plug 'hallettj/jslint.vim'
Plug 'dracula/vim', {'as':'dracula'}
Plug 'turbio/bracey.vim'

call plug#end()

" Basics

set nocompatible
filetype off
syntax on
filetype on
filetype indent on
filetype plugin on
colorscheme dracula
set encoding=utf-8
set nu
set autoindent
set si
set wrap

" Tabs
set tabstop=4
set shiftwidth=4
set expandtab

" Show file stats
set ruler

" Blink cursor on error instead of beeping (grr)
set visualbell

" :W sudo saves the file
command W w !sudo tee % > /dev/null

" Rendering
set ttyfast

" Status bar
set laststatus=2

" Format the status line
set statusline=\ %{HasPaste()}%F%m%r%h\ %w\ \ CWD:\ %r%{getcwd()}%h\ \ \ Line:\ %l\ \ Column:\ %c

" Returns true if paste mode is enabled
function! HasPaste()
    if &paste
        return 'PASTE MODE  '
    endif
    return ''
endfunction

" Last line
set showmode
set showcmd

" Searching
nnoremap / /\v
vnoremap / /\v
set hlsearch
set incsearch
set ignorecase
set smartcase
set showmatch
map <leader><space> :let @/=''<cr> " clear search


