export default function(hook, vm) {
    hook.beforeEach(function(content) {
        return content.replace(/^---[\s\S]*?---\n*/, '');
    });
}