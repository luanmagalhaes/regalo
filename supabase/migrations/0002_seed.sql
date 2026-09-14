do $$
declare
  milla uuid;
  maryjane uuid;
  luan uuid;
begin
  if exists (select 1 from profiles) then
    return;
  end if;

  insert into profiles (name, emoji, palette, loves, dislikes, plenty, position)
  values ('Milla', '🌸', 'morango',
    array['coisas cheirosas', 'decoração', 'livro'],
    array[]::text[],
    array['perfume', 'hidratante'], 0)
  returning id into milla;

  insert into profiles (name, emoji, palette, loves, dislikes, plenty, position)
  values ('MaryJane', '🦋', 'uva',
    array['qualquer coisa, presente é presente'],
    array[]::text[],
    array['hidratante'], 1)
  returning id into maryjane;

  insert into profiles (name, emoji, palette, loves, dislikes, plenty, position)
  values ('Luan', '🎮', 'blueberry',
    array['jogos', 'bebida diferente', 'colar', 'pulseira', 'bermuda', 'perfume'],
    array['boné aba reta', 'coisa muito colorida'],
    array['roupa'], 2)
  returning id into luan;

  insert into profiles (name, emoji, palette, position)
  values ('Yuri Cucuruco', '⭐️', 'pistache', 3),
         ('Flabio', '🍒', 'caramelo', 4);

  insert into profile_items (profile_id, icon, label, value, hint, pending, position) values
    (milla, 'shirt', 'Blusa / camiseta', 'M/G', '', false, 0),
    (milla, 'dress', 'Vestido', 'G', '', false, 1),
    (milla, 'skirt', 'Saia', 'G/GG', '', false, 2),
    (milla, 'pants', 'Calça', '44', 'manequim', false, 3),
    (milla, 'shorts', 'Short', '44', '', false, 4),
    (milla, 'bikini', 'Biquíni', 'G', 'top e calcinha', false, 5),
    (milla, 'swimsuit', 'Maiô', 'G', '', false, 6),
    (milla, 'panties', 'Calcinha', 'GG', '', false, 7),
    (milla, 'bra', 'Sutiã', '44/C', '', false, 8),
    (milla, 'pajamas', 'Pijama', 'GG', '', false, 9),
    (milla, 'coat', 'Casaco', 'M/G', '', false, 10),
    (milla, 'shoe', 'Sapato / tênis', '37', '', false, 11),
    (milla, 'ring', 'Anel', '17', '', false, 12),
    (milla, 'earring', 'Brinco', 'furado', '', false, 13);

  insert into profile_items (profile_id, icon, label, value, hint, pending, position) values
    (maryjane, 'shirt', 'Blusa / camiseta', 'M', '', false, 0),
    (maryjane, 'dress', 'Vestido', 'M', 'P se a forma for grande', false, 1),
    (maryjane, 'skirt', 'Saia', 'P/M', '', false, 2),
    (maryjane, 'pants', 'Calça', '38', 'manequim', false, 3),
    (maryjane, 'shorts', 'Short', '38/M', '', false, 4),
    (maryjane, 'bikini', 'Biquíni', 'M', 'top e calcinha', false, 5),
    (maryjane, 'swimsuit', 'Maiô', 'M', '', false, 6),
    (maryjane, 'panties', 'Calcinha', 'M', '', false, 7),
    (maryjane, 'bra', 'Sutiã', '40/42/M', 'a turma ainda precisa confirmar', true, 8),
    (maryjane, 'pajamas', 'Pijama', 'M', '', false, 9),
    (maryjane, 'coat', 'Casaco', 'G', '', false, 10),
    (maryjane, 'shoe', 'Sapato / tênis', '36', '', false, 11),
    (maryjane, 'ring', 'Anel', '18 ou 19', 'depende do anel', true, 12),
    (maryjane, 'earring', 'Brinco', 'furado', '', false, 13);

  insert into profile_items (profile_id, icon, label, value, hint, pending, position) values
    (luan, 'shirt', 'Camiseta', 'M', 'colada; EXG se for oversized', false, 0),
    (luan, 'shirt', 'Camisa social', 'G', '', false, 1),
    (luan, 'pants', 'Calça', '40', '', false, 2),
    (luan, 'shorts', 'Bermuda', '40', '', false, 3),
    (luan, 'shorts', 'Sunga', 'G', '', false, 4),
    (luan, 'shorts', 'Short de praia', 'M', '', false, 5),
    (luan, 'panties', 'Cueca', 'G', '', false, 6),
    (luan, 'sock', 'Meia', '43', '', false, 7),
    (luan, 'hoodie', 'Casaco / moletom', 'GG', '', false, 8),
    (luan, 'sneaker', 'Tênis', '43', '', false, 9),
    (luan, 'shoe', 'Sapato', '43', '', false, 10),
    (luan, 'ring', 'Anel', '17', 'aproximado, a confirmar', true, 11);
end $$;
