export const readMe = `





# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

this is paragraph with **bold**, _italic_, \`code\`, ~~Strikethrough~~ and footnotes[^1]

[^1]:
    Reference render in a popover by default.
    with _rich_ **content** support
    and multiline



### 🧜‍♀️ Mermaid Diagrams


\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`


\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Submit form
    Frontend->>API: POST /api/data
    API->>Database: INSERT query
    Database-->>API: Success
    API-->>Frontend: 200 OK
    Frontend-->>User: Show success message
\`\`\`

\`\`\`mermaid
pie title Project Time Allocation
    "Development" : 45
    "Testing" : 25
    "Documentation" : 15
    "Meetings" : 15
\`\`\`


### Tables

| Left | Center | Right |
| :--- | :----: | ----: |
| A    |   B    |     C |


### Lists

#### decimal list

1. First item
2. Second item
3. Third item

#### lower-alpha list

a. First item  
b. Second item  
c. Third item

#### upper-alpha list

A. First item  
B. Second item  
C. Third item

#### lower-roman list

i. First item  
ii. Second item  
iii. Third item

#### upper-roman list

I. First item  
II. Second item  
III. Third item

### Alerts 

> [!IMPORTANT]
> Native support for Github style Alert

> [!NOTE]
> Native support for Github style Alert

> [!WARNING]
> Native support for Github style Alert

> [!CAUTION]
> Native support for Github style Alert

> [!TIP]
> Native support for Github style Alert




### Code Blocks

\`\`\`javascript
console.log('Hello from Streamdown!');
\`\`\`

### Math

$$
\\sum_{i=1}^n x_i
$$


$$
S (\\omega)=1.466\\, H_s^2 \\, \\frac{\\omega_0^5}{\\omega^6 } \\, e^[-3^ { \\omega/(\\omega_0  )]^2}
$$


$$
\\int_{-\\infty}^{\\infty} \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\cdot \\sum_{k=0}^{\\infty} \\frac{(-1)^k}{k!} \\left(\\frac{\\lambda t}{\\Gamma(\\alpha+1)}\\right)^k \\, dx = \\prod_{j=1}^{m} \\left[\\frac{\\partial^2}{\\partial z_j^2} + \\omega_j^2\\right] \\psi(z_1, z_2, \\ldots, z_m)
$$

$$
\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u + f(x,t) + \\int_{0}^{t} \\frac{\\partial^2 g(\\tau)}{\\partial \\tau^2} \\, d\\tau + \\sum_{n=1}^{\\infty} \\frac{a_n}{n^2} \\sin(n\\pi x) e^{-\\lambda_n t}
$$






lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.


`;
