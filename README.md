# future_value
Site web pour calculer et visualiser la valeur future.

Si je met 1 000 € dans un compte qui me rapporte 4 % par an, combien d'argent cela me fait-il au bout de 50 ans.
Ce site permet de répondre à cette question et de voir l'évolution des intérets ainsi que du capital.

## Graphe avec uPlot

Ouvrir `index.html` dans un navigateur, saisir les valeurs et cliquer sur **VALIDER**.
Le graphe utilise les fichiers locaux `uPlot.iife.min.js` et `uPlot.min.css` (version 1.6.32), sans CDN.
La licence de la bibliothèque est conservée dans `uPlot.LICENSE`.

Dans `main.js`, `makeGraph` prépare les données au format attendu par uPlot :

```js
const data = [periods, dataValue, dataInterestPart];
// Exemple : [[0, 1, 2], [1000, 1040, 1081.6], [0, 40, 41.6]]
```

Les trois tableaux ont la même longueur. La période 0 représente le capital initial ;
les intérêts affichés sont ceux de chaque période, comme dans le tableau, et non leur cumul.
`scales.x.time: false` indique que l'axe horizontal contient des numéros de période.
`series` définit la légende et le style de chaque série, dans le même ordre que `data`.

`new uPlot(options, data, graphContainer)` crée le graphe dans une `<div>` :
uPlot crée lui-même son canvas. Les calculs suivants utilisent `graph.setData(data)`
pour mettre à jour le même graphe. Un `ResizeObserver` adapte sa largeur avec `graph.setSize()`.

Toutes les périodes sont tracées ; les graduations s'espacent automatiquement selon la place disponible.
Survoler les courbes pour lire les montants en euros dans la légende.
Sélectionner une zone en glissant pour zoomer, puis double-cliquer pour revenir à la vue complète.

Documentation : https://github.com/leeoniya/uPlot/blob/master/docs/README.md
