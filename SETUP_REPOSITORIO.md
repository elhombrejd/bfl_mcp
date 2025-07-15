# 📋 Setup do Repositório - bfl-mcp-server

## 🚀 Instruções para Publicação

### 1. Renomear Pasta do Projeto
```bash
# Mova para o diretório pai e renomeie
cd ..
mv bfl_mcp bfl-mcp-server
cd bfl-mcp-server
```

### 2. Criar Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new)
2. **Repository name**: `bfl-mcp-server`
3. **Description**: "Model Context Protocol server for Black Forest Labs FLUX image generation and editing"
4. **Public repository** (recomendado para NPM packages)
5. **NÃO** initialize with README (já temos)

### 3. Conectar ao GitHub
```bash
# Adicionar remote origin
git remote add origin https://github.com/elhombrejd/bfl-mcp-server.git

# Push inicial
git branch -M main
git push -u origin main
```

### 4. Publicar no NPM
```bash
# Login no NPM (se necessário)
npm login

# Publicar o pacote
npm publish --access public
```

### 5. Testar Instalação
```bash
# Testar se funciona globalmente
npx @elhombrejd/bfl-mcp-server --help
```

## 📦 Informações do Pacote

- **Nome NPM**: `@elhombrejd/bfl-mcp-server`
- **Comando**: `npx @elhombrejd/bfl-mcp-server`
- **Repositório**: `https://github.com/elhombrejd/bfl-mcp-server`
- **Author**: `elhombrejd`

## 🎯 URLs Importantes

- **NPM Package**: `https://www.npmjs.com/package/@elhombrejd/bfl-mcp-server`
- **GitHub Repo**: `https://github.com/elhombrejd/bfl-mcp-server`
- **Issues**: `https://github.com/elhombrejd/bfl-mcp-server/issues`

## ✅ Checklist Final

- [x] Código implementado e testado
- [x] Documentação completa
- [x] Package.json configurado com @elhombrejd
- [x] Commits organizados
- [ ] Repositório criado no GitHub
- [ ] Publicado no NPM
- [ ] Testado via npx

---

Após seguir esses passos, o servidor MCP estará disponível globalmente via:
```bash
npx @elhombrejd/bfl-mcp-server YOUR_BFL_API_KEY
```