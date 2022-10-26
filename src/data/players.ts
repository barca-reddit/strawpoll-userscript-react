import type { IPlayerList, IPlayer } from '../types.js';

const players: Omit<IPlayer, 'id' | 'selected'>[] = [
    { name: 'Marc-André ter Stegen', number: 1, position: 'gk', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115376025940019/01-ter-stegen.png' },
    { name: 'Iñaki Peña', number: 26, position: 'gk', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116290774282260/26-inaki.png' },
    { name: 'Ander Astralaga', number: 31, position: 'gk', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116294033248307/31-astralaga.png' },
    { name: 'Arnau Tenas', number: 36, position: 'gk', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116714986176532/36-arnau.png' },
    { name: 'Héctor Bellerín', number: 2, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115376411820072/02-bellerin.png' },
    { name: 'Gerard Piqué', number: 3, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115377309384714/03-pique.png' },
    { name: 'Ronald Araújo', number: 4, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115377632358431/04-araujo.png' },
    { name: 'Andreas Christensen', number: 15, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115910388654160/15-christensen.png' },
    { name: 'Marcos Alonso', number: 17, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115910925537310/17-alonso.png' },
    { name: 'Jordi Alba', number: 18, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115911290421248/18-alba.png' },
    { name: 'Jules Koundé', number: 23, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115913236594688/23-kounde.png' },
    { name: 'Eric Garcia', number: 24, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116290233204736/24-eric.png' },
    { name: 'Álex Baldé', number: 28, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116292544278618/28-balde.png' },
    { name: 'Alex Valle', number: 33, position: 'def', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116294960189480/33-valle.png' },
    { name: 'Sergio Busquets', number: 5, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115378022432819/05-busquets.png' },
    { name: 'Pedri', number: 8, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115378869674014/08-pedri.png' },
    { name: 'Franck Kessié', number: 19, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115911684698152/19-kessie.png' },
    { name: 'Sergi Roberto', number: 20, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115912007667762/20-sergi.png' },
    { name: 'Frenkie de Jong', number: 21, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115912519352360/21-frenkie.png' },
    { name: 'Marc Casado', number: 29, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116293123080212/29-casado.png' },
    { name: 'Gavi', number: 30, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116293584465940/30-gavi.png' },
    { name: 'Pablo Torre', number: 32, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116294389760060/32-torre.png' },
    { name: 'Álvaro Sanz', number: 34, position: 'mid', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116295572570153/34-sanz.png' },
    { name: 'Ousmane Dembélé', number: 7, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115378391519242/07-dembele.png' },
    { name: 'Robert Lewandowski', number: 9, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115379217813534/09-lewandowski.png' },
    { name: 'Ansu Fati', number: 10, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115379616251924/10-fati.png' },
    { name: 'Ferran Torres', number: 11, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115909625299035/11-ferran.png' },
    { name: 'Memphis Depay', number: 14, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115909944053790/14-memphis.png' },
    { name: 'Raphinha', number: 22, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023115912884265000/22-raphinha.png' },
    { name: 'Ilias Akomach', number: 27, position: 'att', photo: 'https://cdn.discordapp.com/attachments/784418814661623809/1023116292057743461/27-akomach.png' }
];

export const playerList = players.reduce<IPlayerList>((acc, player, index) => {
    acc.byId[index] = { ...player, id: index, selected: false };
    acc.byPosition[player.position].push(index);
    return acc;
}, { byId: {}, byPosition: { gk: [], def: [], mid: [], att: [] }, selectedCount: 0 });