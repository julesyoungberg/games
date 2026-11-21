// Overtime 6. Unlocks after Shift 14. Uses: launching, springs, standing on heads, pulling Nut, latch gates.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Performance Bonus', sub: 'Overtime. Exceed expectations. Literally. Upward.', theme: 7, after: 13,
  intro: ['Overtime! Tonight we are handing out performance bonuses. To get one, you have to perform. Above the bar. The bar is quite high.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Raise Request: the spring sits on a pillar. Nut launches Bolt onto it; he bounces up to the plate shelf */
    L.floor(0, -8, 22, 0, 0); BW(L, 0, 22, 0);
    L.spring(8, -7.5, 10, -4.5, 2.8, 18);
    L.box(11.5, -8, 15, -5, -6, 6, 'shelf'); BW(L, 11.5, 15, 6);
    L.plate(13.3, -6.5, 1, 6);
    L.gate(17, -8, 18, 0, 0, 12, [1], { latch: true }); L.box(17, -9.5, 18, -8, -6, 12, 'wall');
    L.cog(9, 8.3, -7.3);
    /* ---- 2. Piggyback Bonus: the ledge is higher than any bounce. Bolt rides Nut up the spring and jumps off her head at the top */
    L.floor(22, -8, 26, 0, 0); BW(L, 22, 26, 0);
    L.spring(26, -8, 28.5, 0, -0.3, 20); BW(L, 26, 28.5, 0);
    L.floor(28.5, -8, 29.5, 0, 0); BW(L, 28.5, 29.5, 0);
    L.floor(29.5, -8, 44, 0, 7.6); BW(L, 29.5, 44, 7.6);
    L.exit(38, -6.5, 42, -1.5, 7.6);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(18.5, -8, 24, 0, 20, -2.5, 20, -5);
    L.checkpoint(30, -8, 37, 0, 32, -2.5, 32, -5);
    L.zone('raise', 4, -8, 8, 0);
    L.zone('piggy', 19, -8, 25, 0);
    L.zone('end', 30, -8, 44, 0, 6.5, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 10, 'pipe'); L.deco(40, -11, 41.5, -9.5, 7.6, 18, 'pipe');
    L.sign(4, 1.6, -7.9, 'BONUSES ↑');
    L.sign(24, 1.6, -7.9, 'THE BAR');
  },
  zones: {
    raise: { say: ['To get through the gate, someone must sit on the plate on that shelf. The spring that goes there is on a pillar. Nobody can reach the pillar. Alone.'], hint: 'Nut launches Bolt onto the spring on top of the pillar. Bolt bounces up and steers onto the plate on the shelf. The gate stays open. Then both of you go through.' },
    piggy: { say: ['This is the bar. It is higher than any spring. Higher than any launch. I measured it myself. With a very long ruler.', 'Of course, Nut bounces too. And Bolt is very good at standing on things.'], hint: 'Bolt stands on Nut\'s head. Nut walks onto the spring, carrying Bolt up with her. At the top of the bounce Bolt jumps off her head onto the ledge. Then Bolt pulls Nut up while she bounces.' },
    end: { say: ['You cleared the bar. The bar has been informed and is taking it well.'] },
  },
  outro: 'Overtime done. Your performance bonus is a sticker. It says "Above". Wear it with pride.',
};
