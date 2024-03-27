# Direnv GitHub Action

This GitHub Action installs [direnv](https://direnv.net/), an environment switcher for the shell. It makes it easy to manage project-specific environment variables without cluttering your shell startup files.

## Usage

To use this action in your workflow, add the following step:

```yaml
- uses: andreygubarev/direnv-action@v1
  with:
    version: '2.28.0'
```

This action supports multiple platforms and architectures, which are automatically detected based on the runner that the action is executed on.

## Inputs

### `version`

**Optional** The version of direnv to install. Default is `latest`.

## Outputs
This action does not have any outputs.

## Example usage
```yaml
uses: andreygubarev/direnv-action@v1
with:
  version: '2.28.0'
```
