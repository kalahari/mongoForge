import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Use 'null' instead of 'undefined'";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UndefinedWalker(sourceFile, this.getOptions()));
    }
}

class UndefinedWalker extends Lint.RuleWalker {
    public visitNode(node: ts.Node) {
        super.visitNode(node);
        if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    }
}