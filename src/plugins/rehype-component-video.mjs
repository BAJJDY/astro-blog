export function VideoComponent() {
	return (node) => {
		// 检查是否为视频指令
		if (node.type !== "element" || node.tagName !== "video") {
			return;
		}

		// 获取属性
		const id = node.properties.id;
		const width = node.properties.width || "100%";
		const height = node.properties.height;
		const ratio = node.properties.ratio || "16:9";

		// 验证必需的属性
		if (!id) {
			console.error("Video directive requires an id attribute");
			return;
		}

		// 根据比例计算高度（如果未指定）
		let calculatedHeight = height;
		if (!height) {
			const [widthRatio, heightRatio] = ratio.split(":").map(Number);
			if (widthRatio && heightRatio) {
				// 假设宽度是百分比或像素值
				if (typeof width === "string" && width.includes("%")) {
					// 对于百分比宽度，使用 padding-top 来维持比例
					const paddingTop = (heightRatio / widthRatio) * 100;
					return {
						type: "element",
						tagName: "div",
						properties: {
							id: id,
							style: `width: ${width}; padding-top: ${paddingTop}%; position: relative;`,
						},
						children: [
							{
								type: "element",
								tagName: "div",
								properties: {
									style:
										"position: absolute; top: 0; left: 0; width: 100%; height: 100%;",
								},
								children: node.children,
							},
						],
					};
				}
				// 对于固定宽度，计算固定高度
				const widthValue = Number.parseInt(width, 10);
				if (!Number.isNaN(widthValue)) {
					calculatedHeight = (widthValue * heightRatio) / widthRatio;
				}
			}
		}

		// 返回视频容器
		return {
			type: "element",
			tagName: "div",
			properties: {
				id: id,
				style: `width: ${width}; ${calculatedHeight ? `height: ${calculatedHeight};` : ""}`,
			},
			children: node.children,
		};
	};
}
