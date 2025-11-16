# Simulating the Second Law of Thermodynamics (Part 1: Money)

## People and Money

Let's imagine a somewhat absurd social experiment: in a nation, the state has distributed the same amount of money to all its citizens. Before this distribution, no citizen possessed any money; after it, each citizen found themselves with **1 Kinetic** in their pocket. All citizens are forbidden from exchanging money with inhabitants of other nations, but internal money exchanges are possible according to a very specific scheme illustrated below.

Every time two citizens meet, they pool all their money and divide the total into two parts completely at random. Regularly, many encounters occur, and therefore money exchanges take place.

Let's translate this money division operation into formulas during a meeting between two people. We define the following quantities:

- $e_1$ is the money possessed by the first citizen before the meeting
- $e_2$ is the money possessed by the second citizen before the meeting
- $e_1'$ is the money possessed by the first citizen after the meeting
- $e_2'$ is the money possessed by the second citizen after the meeting

Since no money is lost, it's clear that $e_1+e_2=e_1'+e_2'$. These two sums equal the amount of the total pool mentioned above. To divide it into two random parts, we draw a real number $x$ between 0 and 1. The value of $x$ is drawn from an appropriate probability distribution $p(x)$ decided by the nation's government.

Therefore, we can state that the two people after the exchange find themselves with respectively:

- $e_1'=x (e_1+e_2)$
- $e_2'=(1-x) (e_1+e_2)$

For the money exchange to be fair on average, the probability distribution $p(x)$ must be symmetric about the axis $x=\frac{1}{2}$.

At this point the question is: **how does the wealth distribution of the citizens of this hypothetical and imaginative nation evolve?**

Let's try to answer by simulating this hypothetical economy on a computer, specifically through an [agent-based model](https://en.wikipedia.org/wiki/Agent-based_model). We'll discover that the answer to the question depends on the function $p(x)$ introduced above.

## Entropy and Order

Before proceeding, let's make one more reflection on the money distribution in the nation. Immediately after the initial money distribution, all citizens possess **1 Kinetic**: this situation is extremely ordered. There is only one possible way to realize it, and that is when each person possesses **1 Kinetic**.

Let's better explain how to count the ways of realizing a money distribution with a second example slightly more disordered than the first: all citizens possess **1 Kinetic** except one person who possesses **2 Kinetic**. If there are $N$ citizens in total, this situation can be realized in $N$ ways because I have $N$ different possibilities to draw the lucky citizen with **2 Kinetic** in their pocket.

We can go further and generalize this calculation, but let's leave this burden to the simulation. Is it useful to count the ways in which a certain wealth distribution can be realized? Yes, because it allows us to calculate the entropy of the distribution: if $W$ is the number of ways to generate the distribution, the entropy $S$ is:

$$
S=k \log(W)
$$

according to the statistical definition of entropy given by Boltzmann. We'll set $k = 1$ and treat entropy as a dimensionless quantity.

## The Simulation

> "A simulation is the answer to the question, 'What if…?'"
>
> *Richard W. Hamming*

The simulation code is available on my [GitHub repository](https://github.com/profConradi/Python_Simulations/blob/main/Statistical_Approach_2nd_law.ipynb).

We consider different probability distributions $p(x)$. We use the integer parameter $d$ ($d\ge 2$) to parametrize the family of functions $p(x)$ in the following way:

$$
p_d(x) = (x-x^2)^{\frac{d-2}{2}}
$$

We'll return to the form of these functions later.

Each simulation involves 5000 people and lasts 20000 elementary steps: at each step, two random citizens meet, put all the money in their possession on the table, and redistribute it according to the proportions $x$ and $1-x$. The value $x$ was randomly drawn according to the probability distribution $p_d(x)$.

## Results for Different Values of d

Let's see what happens for the first values of $d$. The following graph represents the situation for the 4 cases $d=2, 3, 4, 5$ and shows:

- The function $p_d(x)$
- The wealth distribution after 20000 steps

![Probability vs d](../images/prob_vs_d.png)
*Figure 1: Probability distributions and resulting wealth distributions for different values of d*

In the case $d=2$, all values of $x$ between 0 and 1 are equiprobable, and those who possess little or nothing constitute the majority of the population.

As $d$ increases, the probability distribution $p_d(x)$ tends to increasingly disfavor money exchanges of the all-or-nothing type, and consequently, the number of people with nothing decreases.

## Connection to Thermodynamics

But what does all this have to do with the second law of thermodynamics? Why did we choose that particular analytical form for the function $p_d(x)$?

We'll answer these questions in the next article. Meanwhile, here are two videos of the simulations for $d=2$ and $d=3$.

### Case d=2 (Uniform Distribution)

<video controls width="100%">
  <source src="../videos/2nd_law_random-uniform.mp4" type="video/mp4">
  Your browser does not support video playback.
</video>

*Video 1: Wealth distribution evolution with uniform probability (d=2)*

### Case d=3 (Maxwell-Boltzmann-like Distribution)

<video controls width="100%">
  <source src="../videos/2nd_law_maxwell-boltzman.mp4" type="video/mp4">
  Your browser does not support video playback.
</video>

*Video 2: Wealth distribution evolution with d=3 probability*

## Observations

The simulations reveal fascinating parallels between economic systems and thermodynamic systems:

1. **Entropy increase**: The system evolves from an ordered state (equal wealth) to a disordered state
2. **Equilibrium distribution**: The final distribution depends on the "interaction rules" ($p_d(x)$)
3. **Irreversibility**: The system doesn't spontaneously return to equal wealth distribution
4. **Statistical mechanics**: Individual random exchanges lead to predictable macroscopic patterns

These connections illustrate how statistical mechanics principles apply beyond physics, providing insights into complex systems ranging from economics to social dynamics.

## References

1. [A statistical approach to the second law of thermodynamics using a computer simulation, L. Bellomonte and R. M. Sperandeo-Mineo](https://iopscience.iop.org/article/10.1088/0143-0807/18/5/002/meta)

---

*Copyright 2023 by Simone Conradi, licensed under [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/)*
