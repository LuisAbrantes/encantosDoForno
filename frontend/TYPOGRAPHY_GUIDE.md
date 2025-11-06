# 🎨 Guia de Tipografia - Encantos do Forno

## Fontes Configuradas

### 1. **Pacifico** - Títulos Principais e Logo

**Uso:** Títulos H1, Logo principal, Títulos de seções importantes

**Classes Tailwind:**

```jsx
className = 'font-pacifico text-5xl';
```

**Classes CSS:**

```jsx
className = 'font-pacifico';
```

**Exemplo:**

```jsx
<h1 className="font-pacifico text-5xl text-orange-900">Encantos do Forno</h1>
```

---

### 2. **Dancing Script** - Subtítulos e Destaques

**Uso:** Subtítulos (H2, H3), Textos de destaque, Frases de efeito

**Classes Tailwind:**

```jsx
className = 'font-dancing text-3xl';
```

**Classes CSS:**

```jsx
className = 'font-dancing';
```

**Exemplo:**

```jsx
<h2 className="font-dancing text-4xl text-amber-700">Nossa História</h2>
```

---

### 3. **Great Vibes** - Chamadas de Ação e Menus

**Uso:** Botões especiais, Menus destacados, CTAs elegantes

**Classes Tailwind:**

```jsx
className = 'font-vibes text-2xl';
```

**Classes CSS:**

```jsx
className = 'font-vibes';
```

**Exemplo:**

```jsx
<button className="font-vibes text-3xl bg-orange-700 text-white px-8 py-4 rounded-lg">
    Faça sua Reserva
</button>
```

---

### 4. **Allura** - Seções Elegantes

**Uso:** Depoimentos, Bio da equipe, Citações, Textos especiais

**Classes Tailwind:**

```jsx
className = 'font-allura text-2xl';
```

**Classes CSS:**

```jsx
className = 'font-allura';
```

**Exemplo:**

```jsx
<p className="font-allura text-2xl text-gray-700 italic">
    "A melhor pizza artesanal que já comi!"
</p>
```

---

### 5. **Inter** - Textos Corridos (Padrão)

**Uso:** Parágrafos, Descrições, Textos longos, Formulários

**Classes Tailwind:**

```jsx
className = 'font-sans text-base';
```

**Exemplo:**

```jsx
<p className="font-sans text-gray-700 leading-relaxed">
    Localizado em Jacareí, o Encantos do Forno oferece delícias feitas com
    ingredientes frescos...
</p>
```

---

## Classes Auxiliares

### Legibilidade Melhorada

```jsx
// Adiciona sombra sutil para melhor contraste
className = 'text-readable';

// Sombra mais forte para fundos claros
className = 'text-readable-dark';
```

### Tamanhos Cursivos Responsivos

```jsx
className = 'text-cursive-lg'; // 18px
className = 'text-cursive-xl'; // 20px
className = 'text-cursive-2xl'; // 24px
```

### Espaçamento de Letras

```jsx
className = 'tracking-cursive'; // 0.02em
className = 'tracking-cursive-wide'; // 0.03em
```

### Altura de Linha

```jsx
className = 'leading-cursive'; // 1.4
className = 'leading-cursive-relaxed'; // 1.6
```

---

## Boas Práticas

### ✅ Recomendações

1. **Use Pacifico** para títulos grandes e logo (máximo 1-2 por página)
2. **Use Dancing Script** para subtítulos (H2, H3)
3. **Use Great Vibes** em botões e CTAs para elegância
4. **Use Allura** em depoimentos e textos especiais
5. **Use Inter** para todo o texto corrido e descrições

### ⚠️ Evite

-   Usar fontes cursivas em textos longos (mais de 2 linhas)
-   Fontes cursivas em tamanhos muito pequenos (< 16px)
-   Misturar mais de 2 fontes cursivas na mesma seção
-   Usar fontes cursivas em formulários de entrada

### 📱 Responsividade

Em telas pequenas, as fontes cursivas são automaticamente ajustadas:

-   Espaçamento reduzido
-   Tamanho ligeiramente menor quando necessário

```jsx
// Adicione esta classe para ajuste automático em mobile
className = 'responsive-cursive';
```

---

## Exemplos Práticos

### Hero Section

```jsx
<h1 className="font-pacifico text-6xl md:text-7xl text-white text-readable-dark">
  Encantos do Forno
</h1>
<p className="font-dancing text-2xl text-amber-100">
  Sabor artesanal de Jacareí
</p>
```

### Seção de Depoimentos

```jsx
<blockquote className="font-allura text-2xl text-gray-700 italic text-readable">
  "Simplesmente maravilhoso! Voltarei com certeza."
</blockquote>
<cite className="font-sans text-sm text-gray-600">
  - Maria Silva
</cite>
```

### Call to Action

```jsx
<button className="font-vibes text-3xl bg-orange-700 hover:bg-orange-800 text-white px-10 py-4 rounded-lg transition-all duration-300">
    Reserve Agora
</button>
```

### Cardápio

```jsx
<h3 className="font-dancing text-3xl text-orange-900 mb-2">
  Pizza Margherita
</h3>
<p className="font-sans text-gray-600 leading-relaxed">
  Molho de tomate, mussarela, manjericão fresco e azeite extra virgem.
</p>
```

---

## Como Usar no Código

### Método 1: Classes CSS Customizadas

```jsx
<h1 className="font-pacifico">Título</h1>
```

### Método 2: Classes Tailwind

```jsx
<h2 className="font-dancing text-4xl text-orange-900">Subtítulo</h2>
```

### Método 3: Combinado

```jsx
<p className="font-allura text-2xl text-readable text-gray-700 italic leading-cursive-relaxed">
    Texto elegante
</p>
```

---

## Contraste e Acessibilidade

✅ **Sempre teste a legibilidade:**

-   Fontes cursivas devem ter tamanho mínimo de 18px
-   Use cores com bom contraste (AA WCAG)
-   Adicione `text-readable` ou `text-readable-dark` quando necessário
-   Evite fontes cursivas em textos críticos (formulários, avisos)

---

## Fallback

Todas as fontes têm fallback para cursivas padrão do sistema:

```css
font-family: 'Pacifico', cursive, 'Dancing Script', serif;
```

Se o Google Fonts falhar, o navegador usará fontes cursivas do sistema.
